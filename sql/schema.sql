CREATE DATABASE employees_db;

USE employees_db;
CREATE TABLE department (
	id INT PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL
);

USE employees_db;
CREATE TABLE role (
	id INT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(65, 2) NOT NULL,
	department_id INT NOT NULL,
	FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

USE employees_db;
CREATE TABLE employee (
	id INT PRIMARY KEY NOT NULL,
	first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
