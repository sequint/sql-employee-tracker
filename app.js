const mysql = require('mysql2')
const { prompt } = require('inquirer')
require('dotenv').config()

const db = mysql.createConnection(`mysql://root:${process.env.PASSWORD}@localhost:3306/employees_db`)



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
            else { console.log(`New ${table} created!`) }
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
            else { console.log(`New ${table} created!`) }
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
                  else { console.log(`New ${table} created!`) }
                })
              })
          }
          else {
            // Insert new employee object without a manager id.
            db.query(`INSERT INTO ${table} SET ?`, newEmployee, err => {
              if (err) { console.log(err) }
              else { console.log(`New ${table} created!`) }
            })
          }
          
        })
      break
    default:
      console.log('Invalid selection, terminating program.')
      process.exit()   
  }

}

// View DB
// Update DB

// Array of actions to choose from to manipulate or display tables.
const actions = ['Add To a Table', 'View a Table', 'Update Employee Roles', 'Exit Program']

//Get action
const getActionSelection = table => {

  // Prompt the user to select an action to take.
  prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Please an action to take',
      choices: actions
    }
  ])
    .then(({ action }) => {
      switch (action) {
        case 'Add To a Table':
          addToTable(table)
          break
        case 'View a Table':
          console.log(`${action} function.`)
          break
        case 'Update Employee Roles':
          console.log(`${action} function.`)
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

// Array of the tables that make up the employees database.
const tables = ['Departments', 'Roles', 'Employees', 'Exit']

// Main menu
const mainMenu = () => {

  // Prompt the user for a table selection and return the selection.
  prompt([
    {
      type: 'list',
      name: 'table',
      message: 'Select a table: ',
      choices: tables
    }
  ])
    .then(({ table }) => {
      switch (table) {
        case 'Departments':
          getActionSelection('department')
          break
        case 'Roles':
          getActionSelection('role')
          break
        case 'Employees':
          getActionSelection('employee')
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