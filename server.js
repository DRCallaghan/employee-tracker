// importing dependencies
const { table } = require('console');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { title } = require('process');
const questions = require('./src/questions.js');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'J7!mM3#?B3jtczG?',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// initialization function and logic handling for all possible requests
const init = () => {
    inquirer
        .prompt(questions)
        .then((response) => {
            if (response.proceed == 'View All Departments') {
                // running a query to select only the department id and name
                db.query('SELECT * FROM departments', function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        console.table(results);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'View All Roles') {
                db.query('SELECT roles.role_id, roles.role_title, roles.role_salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.department_id ORDER BY roles.role_id ASC', function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        console.table(results);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'View All Employees') {
                db.query('SELECT employees.employee_id, employees.employee_first_name, employees.employee_last_name, roles.role_title, departments.department_name as Department, roles.role_salary, CONCAT(manager.employee_first_name, " ", manager.employee_last_name) as manager FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees manager ON manager.employee_id = employees.manager_id', function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        console.table(results);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Add a Department') {
                db.query('INSERT INTO departments (department_name) VALUES (?)', response.newDepartment, function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        console.log(`Added the ${response.newDepartment} department!`);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Add a Role') {
                db.query('INSERT INTO roles (role_title, role_salary, department_id) VALUES (?, ?, ?)', [response.newRoleTitle, response.newRoleSalary, response.newRoleDepartment], function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                    } else {
                        // logging results
                        console.log(`Added the ${response.newRoleTitle} role!`);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Add an Employee') {
                // fetching the manager id based on the manager name
                let managerId = db.query('SELECT employee_id FROM employees WHERE CONCAT(employee_first_name, " ", employee_last_name) = ?', response.newEmployeeManager, function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                    } else {
                        return results;
                    }
                });
                // declaring an inserter array for the full query
                let inserter = [response.newEmployeeFirstName, response.newEmployeeLastName, response.newEmployeeRoleId, managerId];
                // querying the db to insert the new employee
                db.query('INSERT INTO employees (employee_first_name, employee_last_name, role_id, manager_id) VALUES (?)', inserter, function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                    } else {
                        // displaying the results
                        console.log(`Added ${response.newEmployeeFirstName} ${response.newEmployeeLastName} to the employee database!`);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Update an Employee Role') {
                // fetching the employee id based on the employee name
                let employeeId = db.query('SELECT employee_id FROM employees WHERE CONCAT(employee_first_name, " ", employee_last_name) = ?', response.updateEmployeeName, function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                    } else {
                        return results;
                    }
                });
                // fetching the role id based on the role name
                let roleId = db.query('SELECT role_id FROM roles WHERE role_id = ?', response.updateEmployeeRole, function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                    } else {
                        return results;
                    }
                });
                // declaring an inserter array for the full query
                let inserter = [employeeId, roleId];
                db.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', inserter, function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        console.log(`Updated ${response.updateEmployeeName}'s Role to ${response.updateEmployeeRole}!`);
                    }
                });
                // running the prompt again
                init();
            } else {
                console.log(`Thank you for choosing Dennis Callaghan's Employee Tracker! To donate to the cause, please visit https://www.paypal.com/paypalme/my/profile to support my future projects.`);
                process.exit(0);
            }
        });
}

init();

// keep adding db queries and console tables as needed for all future options
// add src file for questions and flush out inquirer prompt