const mysql = require('mysql2');

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

let departments = [];
db.query('SELECT CONCAT(department_id, ": ", department_name) AS department_name FROM departments', function (err, results) {
    // catching any errors
    if (err) {
        console.error(err);
    } else {
        // clearing the departments array if there is anything in it
        departments.splice(0, 0);
        // looping over the results object array
        for (var i = 0; i < results.length; i++) {
            var row = results[i];
            // pushing each result into the departments array
            departments.push(row.department_name);
        }
        return departments;
    }
});

// all questions for user input. changes depending on answer to proceed
const questions = [
    {
        type: 'list',
        name: 'proceed',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Finish'],
        default: 0
    },
    {
        type: 'input',
        name: `newDepartment`,
        message: `What is the name of the new deparment?`,
        // only asking this question when the user wants to add a department
        when(answers) {
            return answers.proceed === 'Add a Department'
        },
        // validating that a valid department name was given
        validate: newDepartment => {
            if (typeof newDepartment == 'string' && newDepartment.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid department name.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `newRoleTitle`,
        message: `What is the title of the new role?`,
        // only asking this question when the user wants to add a role
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        // validating that a valid title was given
        validate: newRoleTitle => {
            if (typeof newRoleTitle == 'string' && newRoleTitle.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid role title.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `newRoleSalary`,
        message: `What is the salary for this role?`,
        // only asking this question when the user wants to add a role
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        // validating that a number was given
        validate: newRoleSalary => {
            if (/^\d+$/.test(newRoleSalary)) {
                return true;
            } else {
                console.log('A valid salary is required for this role.');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: `newRoleDepartment`,
        message: `What department does this role fall under?`,
        // only asking this question when the user wants to add a role
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        choices: departments,
        default: 0,
        filter(answer) {
            // fetching the department id based on the department name
            let position = answer.search(/:/);
            let departmentRow = answer.substring(0, position);
            return parseInt(departmentRow);
        }
    },
    {
        type: 'input',
        name: `internName`,
        message: `What is the name of this intern?`,
        // only asking this question when the user wants to add an intern
        when(answers) {
            return answers.proceed === 'Add an Intern'
        },
        // validating that a string was given
        validate: internName => {
            if (typeof internName == 'string') {
                return true;
            } else {
                console.log('A intern is required for your team.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `internId`,
        message: `What is the employee ID of this intern?`,
        // only asking this question when the user wants to add an intern
        when(answers) {
            return answers.proceed === 'Add an Intern'
        },
        // validating that a number was given
        validate: internId => {
            if (/^\d+$/.test(internId)) {
                return true;
            } else {
                console.log('An ID number is required for your intern.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `internEmail`,
        message: `What is the email address of this intern?`,
        // only asking this question when the user wants to add an intern
        when(answers) {
            return answers.proceed === 'Add an Intern'
        },
        // validating that an email was given
        validate: internEmail => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(internEmail)) {
                return true;
            } else {
                console.log('An email address is required for your intern.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `internSchool`,
        message: `What school does Intern  attend?`,
        // only asking this question when the user wants to add an intern
        when(answers) {
            return answers.proceed === 'Add an Intern'
        },
        // validating that a string was given
        validate: internSchool => {
            if (typeof internSchool == 'string') {
                return true;
            } else {
                console.log('A School is required for your intern.');
                return false;
            }
        }
    }
]

module.exports = questions;