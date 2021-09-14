const mysql = require('mysql2')
const { prompt } = require('prompt')
require('dotenv').config()

const db = mysql.createConnection(`mysql://root:${process.env.PASSWORD}@localhost:3306/employees_db`)

// Array of the tables that make up the employees database.
const tables = ['Departments', 'Roles', 'Employees']



// Add to DB
// View DB
// Update DB

//Get table
const getTableSelection = action => {

  // Prompt the user for a table selection and return the selection.
  prompt([
    {
      type: 'list',
      title: 'table',
      message: 'Select a table: ',
      choices: tables
    }
  ])
    .then(({ table }) => {
      switch (table) {
        case 'Departments':
          console.log(`${table}: ${action}`)
          break
        case 'Roles':
          console.log(`${table}: ${action}`)
          break
        case 'Employees':
          console.log(`${table}: ${action}`)
          break
      }
    })
    .catch(err => console.log(err))

}

// Main menu