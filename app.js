const mysql = require('mysql2')
const db = mysql.createConnection('mysql://root:rootroot@localhost:3306/users_db')
require('dotenv').config()