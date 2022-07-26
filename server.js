// importing dependencies
const { table } = require('console');
const inquirer = require('inquirer');
const mysql = require('mysql2');

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
            if (response.proceed == 'view all departments') {
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
            } else if (response.proceed == 'view all roles') {
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
            } else {
                console.log(`Thank you for choosing Dennis Callaghan's Employee Tracker! To donate to the cause, please visit https://www.paypal.com/paypalme/my/profile to support my future projects.`);
            }
        });
}