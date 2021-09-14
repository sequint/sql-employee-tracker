const mysql = require('mysql2')
require('dotenv').config()

const db = mysql.createConnection(`mysql://root:${process.env.PASSWORD}@localhost:3306/employees_db`)
