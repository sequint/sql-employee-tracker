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
        `, (err, employees) => {
    if (err) { console.log(err) }
    else { 
      console.table(employees)
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
        `, (err, joinedTable) => {
          if (err) { console.log(err) }
          else {
            // Create an array to hold employees.
            let departmentEmployees = []
            joinedTable.forEach(employee => {
              if (employee.name === departmentResponse) {
                // let departEmply = {
                //   'First Name': employee.first_name,
                //   'Last Name': employee.last_name,

                // }
                console.table(employee)
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
          type: 'input',
          name: 'depart_id',
          message: 'Enter the department id for this role: '
        }
      ])
        .then(({ title, salary, depart_id }) => {
          // Create a new department object to insert into the table.
          let newRole = {
            title: title,
            salary: salary,
            depart_id: depart_id
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
      break
    case 'employee':
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
          type: 'input',
          name: 'role_id',
          message: 'Enter the role id for this employee: '
        },
        {
          type: 'confirm',
          name: 'hasManager',
          message: 'Does this employee have a manager? (y/n): '
        }
      ])
        .then(({ first_name, last_name, role_id, hasManager }) => {
          // Create a new department object to insert into the table.
          let newEmployee = {
            first_name: first_name,
            last_name: last_name,
            role_id: role_id
          }

          // If the employee has a manager prompt for manager id, insert current object.
          if (hasManager) {
            prompt([
              {
                type: 'input',
                name: 'manager_id',
                message: `Enter employee manager's id: `
              }
            ])
              .then(({ manager_id }) => {
                // Add manager id property to new employee object.
                newEmployee.manager_id = manager_id
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
      break
    default:
      console.log('Invalid selection, terminating program.')
      process.exit()
  }

}

// Array of the tables that make up the employees database.
const tables = ['Departments', 'Roles', 'Employees', 'Exit']

//Get action
const tableSelect = () => {

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
        case 'Update Employee Roles':
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