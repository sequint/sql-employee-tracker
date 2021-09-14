const mysql = require('mysql2')
const { prompt } = require('inquirer')
require('dotenv').config()

const db = mysql.createConnection(`mysql://root:${process.env.PASSWORD}@localhost:3306/employees_db`)



// Add to DB
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
          console.log(`${action} function.`)
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