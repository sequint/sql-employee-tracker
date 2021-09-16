const mysql = require('mysql2')
const { prompt } = require('inquirer')
require('dotenv').config()
require('console.table')

const db = mysql.createConnection(`mysql://root:${process.env.PASSWORD}@localhost:3306/employees_db`)

// View DB
const viewEmployees = _ => {

  db.query(`
        SELECT * FROM  department
        LEFT JOIN role
        ON department.id = role.depart_id
        LEFT JOIN employee
        ON role.id = employee.role_id
        `, (err, allEmployees) => {
    if (err) { console.log(err) }
    else { 
      console.table(allEmployees)
      prompt([
        {
          input: 'confirm',
          name: 'mainMenuAsk',
          message: 'Would you like to go back to the main menu? (y/n): '
        }
      ])
        .then(({ mainMenuAsk }) => {
          if (mainMenuAsk === 'y') {
            mainMenu()
          }
          else {
            console.log('Goodbye!')
            process.exit()
          }
        })
    }
  })

}

const viewByDepartment = _ => {

  // Create an emtpy array to hold department names that will be displayed in prompt.
  let departmentNames = []

  // Query all departments.
  db.query('SELECT * FROM department', (err, departments) => {
    departments.forEach(department => {
      // Push department names into the empty array.
      departmentNames.push(department.name)
    })
    // Prompt the user to select a department to view.
    prompt([
      {
        type: 'list',
        name: 'departmentResponse',
        message: 'Which department would you like to see?',
        choices: departmentNames
      }
    ])
      .then(({ departmentResponse }) => {
        db.query(`
        SELECT * FROM  department
        LEFT JOIN role
        ON department.id = role.depart_id
        LEFT JOIN employee
        ON role.id = employee.role_id
        `, (err, allEmployees) => {
          if (err) { console.log(err) }
          else {
            // Filter array of all employees to ones that match the department requested.
            let departmentFiltered = allEmployees.filter(employee => employee.name === departmentResponse)
            console.table(departmentFiltered)

            prompt([
              {
                input: 'confirm',
                name: 'mainMenuAsk',
                message: 'Would you like to go back to the main menu? (y/n): '
              }
            ])
              .then(({ mainMenuAsk }) => {
                if (mainMenuAsk === 'y') {
                  mainMenu()
                }
                else {
                  console.log('Goodbye!')
                  process.exit()
                }
              })
          }
        })
      })
  })

}

// Add to table
const addToTable = table => {

  // Prompt user for new table information based on table selection.
  switch (table) {
    case 'department':
      prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the department name: '
        }
      ])
        .then(({ name }) => {
          // Create a new department object to insert into the table.
          let newDepartment = {
            name: name
          }

          db.query(`INSERT INTO ${table} SET ?`, newDepartment, err => {
            if (err) { console.log(err) }
            else {
              console.log(`New ${table} created!`)
              prompt([
                {
                  input: 'confirm',
                  name: 'mainMenuAsk',
                  message: 'Would you like to go back to the main menu? (y/n): '
                }
              ])
                .then(({ mainMenuAsk }) => {
                  if (mainMenuAsk) {
                    mainMenu()
                  }
                  else {
                    console.log('Goodbye!')
                    process.exit()
                  }
                })
            }
          })
        })
      break
    case 'role':

      // Create an array used to display department choices.
      db.query('SELECT * FROM department', (err, departments) => {
        if (err) { console.log(err) }
        else {
          let departmentChoices = departments.map(department => department.name)
          
          // Create prompts for all role properties.
          prompt([
            {
              type: 'input',
              name: 'title',
              message: 'Enter title of the role: '
            },
            {
              type: 'input',
              name: 'salary',
              message: 'Enter the salary of the role: '
            },
            {
              type: 'list',
              name: 'departmentChoice',
              message: 'Which department does this role go into?',
              choices: departmentChoices
            }
          ])
            .then(({ title, salary, departmentChoice }) => {
              // Filter new array that matches the selected department to it's object.
              departmentChoice = departments.filter(department => department.name === departmentChoice)

              // Create a new department object to insert into the table.
              let newRole = {
                title: title,
                salary: salary,
                depart_id: departmentChoice[0].id
              }

              db.query(`INSERT INTO ${table} SET ?`, newRole, err => {
                if (err) { console.log(err) }
                else {
                  console.log(`New ${table} created!`)
                  prompt([
                    {
                      input: 'confirm',
                      name: 'mainMenuAsk',
                      message: 'Would you like to go back to the main menu? (y/n): '
                    }
                  ])
                    .then(({ mainMenuAsk }) => {
                      if (mainMenuAsk) {
                        mainMenu()
                      }
                      else {
                        console.log('Goodbye!')
                        process.exit()
                      }
                    })
                }
              })
            })
        }
      })

      break

    case 'employee':

      // Create an array used to display role choices.
      db.query('SELECT * FROM role', (err, roles) => {
        if (err) { console.log(err) }
        else {
          let roleChoices = roles.map(role => role.title)

          prompt([
            {
              type: 'input',
              name: 'first_name',
              message: `Enter the employee's first name: `
            },
            {
              type: 'input',
              name: 'last_name',
              message: `Enter the employee's last name: `
            },
            {
              type: 'list',
              name: 'roleChoice',
              message: 'What role does this employee hold?',
              choices: roleChoices
            },
            {
              type: 'confirm',
              name: 'hasManager',
              message: 'Does this employee have a manager? (y/n): '
            }
          ])
            .then(({ first_name, last_name, roleChoice, hasManager }) => {
              // Filter new array that matches the selected department to it's object.
              roleChoice = roles.filter(role => role.title === roleChoice)

              // Create a new department object to insert into the table.
              let newEmployee = {
                first_name: first_name,
                last_name: last_name,
                role_id: roleChoice[0].id
              }

              // If the employee has a manager prompt for manager id, insert current object.
              if (hasManager) {
                db.query('SELECT * FROM employee', (err, employees) => {
                  if (err) { console.log(err) }
                  else {
                    // Create manager choices array.
                    let managerChoices = employees.map(employee => (employee.first_name + ' ' + employee.last_name))

                    prompt([
                      {
                        type: 'list',
                        name: 'managerChoice',
                        message: `Who will be this person's manager?`,
                        choices: managerChoices
                      }
                    ])
                      .then(({ managerChoice }) => {
                        // Filter employee array to find match object and reassign manager choice.
                        managerChoice = employees.filter(employee => (employee.first_name + ' ' + employee.last_name) === managerChoice)

                        // Add manager id property to new employee object.
                        newEmployee.manager_id = managerChoice[0].id
                        // Insert new employee object without a manager id.
                        db.query(`INSERT INTO ${table} SET ?`, newEmployee, err => {
                          if (err) { console.log(err) }
                          else {
                            console.log(`New ${table} created!`)
                            prompt([
                              {
                                input: 'confirm',
                                name: 'mainMenuAsk',
                                message: 'Would you like to go back to the main menu? (y/n): '
                              }
                            ])
                              .then(({ mainMenuAsk }) => {
                                if (mainMenuAsk) {
                                  mainMenu()
                                }
                                else {
                                  console.log('Goodbye!')
                                  process.exit()
                                }
                              })
                          }
                        })
                      })

                  }
                })
              }
              else {
                // Insert new employee object without a manager id.
                db.query(`INSERT INTO ${table} SET ?`, newEmployee, err => {
                  if (err) { console.log(err) }
                  else {
                    console.log(`New ${table} created!`)
                    prompt([
                      {
                        input: 'confirm',
                        name: 'mainMenuAsk',
                        message: 'Would you like to go back to the main menu? (y/n): '
                      }
                    ])
                      .then(({ mainMenuAsk }) => {
                        if (mainMenuAsk) {
                          mainMenu()
                        }
                        else {
                          console.log('Goodbye!')
                          process.exit()
                        }
                      })
                  }
                })
              }
            })
        }
      })

      break

    default:
      console.log('Invalid selection, terminating program.')
      process.exit()
  }

}

// Update Employee Role Function
const updateRole = () => {

  // Query all departments.
  db.query('SELECT * FROM employee', (err, employees) => {
    if (err) { console.log(err) }
    else {
      // Set new arry to equal employee names.
      let employeeNames = employees.map(employee => employee.first_name + ' ' + employee.last_name)

      // Prompt the user for an employee that they would like to update.
      prompt([
        {
          type: 'list',
          name: 'employeeChoice',
          message: 'Which employee would you like to update?',
          choices: employeeNames
        }
      ])
        .then(({ employeeChoice }) => {
          let matchedEmployee = employees.filter(employee => (employee.first_name + ' ' + employee.last_name) === employeeChoice)
          const employeeCatagories = ['First Name', 'Last Name', 'Role', 'Manager']

          prompt([
            {
              type: 'list',
              name: 'columnChoice',
              message: 'What would you like to update?',
              choices: employeeCatagories
            }
          ])
            .then(({ columnChoice }) => {
              switch (columnChoice) {
                case 'First Name':
                  prompt([
                    {
                      type: 'input',
                      name: 'newFirst',
                      message: 'Enter a new First Name: '
                    }
                  ])
                    .then(({ newFirst }) => {
                      db.query(`UPDATE employee SET first_name = '${newFirst}' WHERE id = '${matchedEmployee[0].id}'`, err => {
                        if (err) { console.log(err) }
                        else {
                          console.log(`Update complete!`)
                          prompt([
                            {
                              input: 'confirm',
                              name: 'mainMenuAsk',
                              message: 'Would you like to go back to the main menu? (y/n): '
                            }
                          ])
                            .then(({ mainMenuAsk }) => {
                              if (mainMenuAsk) {
                                mainMenu()
                              }
                              else {
                                console.log('Goodbye!')
                                process.exit()
                              }
                            })
                            .catch(err => console.log(err))
                        }
                      })
                    })
                    .catch(err => console.log(err))

                  break

                case 'Last Name':
                  prompt([
                    {
                      type: 'input',
                      name: 'newLast',
                      message: 'Enter a new Last Name: '
                    }
                  ])
                    .then(({ newLast }) => {
                      db.query(`UPDATE employee SET last_name = '${newLast}' WHERE id = '${matchedEmployee[0].id}'`, err => {
                        if (err) { console.log(err) }
                        else {
                          console.log(`Update complete!`)
                          prompt([
                            {
                              input: 'confirm',
                              name: 'mainMenuAsk',
                              message: 'Would you like to go back to the main menu? (y/n): '
                            }
                          ])
                            .then(({ mainMenuAsk }) => {
                              if (mainMenuAsk) {
                                mainMenu()
                              }
                              else {
                                console.log('Goodbye!')
                                process.exit()
                              }
                            })
                            .catch(err => console.log(err))
                        }
                      })
                    })
                    .catch(err => console.log(err))

                  break

                case 'Role':
                  db.query('SELECT * FROM role', (err, roles) => {
                    if (err) { console.log(err) }
                    else {
                      let roleNames = roles.map(role => role.title)
                      prompt([
                        {
                          type: 'list',
                          name: 'newRole',
                          message: `Select a new Role for ${matchedEmployee[0].first_name}:`,
                          choices: roleNames
                        }
                      ])
                        .then(({ newRole }) => {
                          let newID = roles.filter(role => role.title === newRole)
                          db.query(`UPDATE employee SET role_id = '${newID[0].id}' WHERE id = '${matchedEmployee[0].id}'`, err => {
                            if (err) { console.log(err) }
                            else {
                              console.log(`Update complete!`)
                              prompt([
                                {
                                  input: 'confirm',
                                  name: 'mainMenuAsk',
                                  message: 'Would you like to go back to the main menu? (y/n): '
                                }
                              ])
                                .then(({ mainMenuAsk }) => {
                                  if (mainMenuAsk) {
                                    mainMenu()
                                  }
                                  else {
                                    console.log('Goodbye!')
                                    process.exit()
                                  }
                                })
                                .catch(err => console.log(err))
                            }
                          })
                        })
                        .catch(err => console.log(err))
                    }
                  })

                  break

                case 'Manager':
                  
                  // Prompt user for selection on if this person is a manager.
                  prompt([
                    {
                      type: 'confirm',
                      name: 'managerOrNot',
                      message: `Will ${matchedEmployee[0].first_name} have a manager? (y/n): `
                    }
                  ])
                    .then(({ managerOrNot }) => {
                      // If the person will not have a manager, set their manager id to null.
                      if(!managerOrNot) {
                        db.query(`UPDATE employee SET manager_id = NULL WHERE ${matchedEmployee[0].id}`, err => {
                          if (err) { console.log(err) }
                          else {
                            console.log('ID set to null.')
                          }
                        })
                      }
                      else {
                        // Query all employees.
                        db.query('SELECT * FROM employee', (err, employees) => {
                          if (err) { console.log(err) }
                          else {
                            // Set new arry to equal employee names.
                            let employeeNames = employees.map(employee => employee.first_name + ' ' + employee.last_name)
                            
                            // Prompt the user for an employee that they would like to update.
                            prompt([
                              {
                                type: 'list',
                                name: 'managerChoice',
                                message: `Which manager will be ${matchedEmployee[0].first_name}'s new manager?`,
                                choices: employeeNames
                              }
                            ])
                              .then(({ managerChoice }) => {
                                let matchedManager = employees.filter(employee => (employee.first_name + ' ' + employee.last_name) === managerChoice)
                                
                                // Set new manager match employee id to the employees new manager id.
                                db.query(`UPDATE employee SET manager_id = ${matchedManager[0].id} WHERE id = ${matchedEmployee[0].id}`, err => {
                                  if (err) { console.log(err) }
                                  else {
                                    console.log(`Update complete!`)
                                  }
                                })

                              })
                              .catch(err => console.log(err))
                          }
                        })
                      }
                    })
                    .catch(err => console.log(err))

                  break
              }
            })

        })
        .catch(err => console.log(err))
    }
  })

}

// Select a Table Function
const tableSelect = () => {

  // Array of the tables that make up the employees database.
  const tables = ['Departments', 'Roles', 'Employees', 'Exit']

  // Prompt the user for a table selection and return the selection.
  prompt([
    {
      type: 'list',
      name: 'table',
      message: 'What would you like to add to?',
      choices: tables
    }
  ])
    .then(({ table }) => {
      switch (table) {
        case 'Departments':
          addToTable('department')
          break
        case 'Roles':
          addToTable('role')
          break
        case 'Employees':
          addToTable('employee')
          break
        case 'Exit Program':
          console.log('Goodbye.')
          process.exit()
        default:
          console.log('Invalid selection, terminating program.')
          process.exit()
      }
    })
    .catch(err => console.log(err))

}

// Array of actions to choose from to manipulate or display tables.
const actions = [
  'View All Employees',
  'View All Employees By Department',
  'Add Department, Role, or Employee',
  'Update Employee Role',
  'Exit Program'
]

// Main menu
const mainMenu = () => {

  // Prompt the user to select an action to take.
  prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: actions
    }
  ])
    .then(({ action }) => {
      switch (action) {
        case 'View All Employees':
          viewEmployees()
          break
        case 'View All Employees By Department':
          viewByDepartment()
          break
        case 'Add Department, Role, or Employee':
          tableSelect()
          break
        case 'Update Employee Role':
          updateRole()
          break
        case 'Exit Program':
          console.log('Goodbye.')
          process.exit()
        default:
          console.log('Invalid selection, terminating program.')
          process.exit()
      }
    })
    .catch(err => console.log(err))

}

// Begin program with the main menu.
mainMenu()