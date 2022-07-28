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

let roles = [];
db.query('SELECT CONCAT(role_id, ": ", role_title) AS role_title FROM roles', function (err, results) {
    // catching any errors
    if (err) {
        console.error(err);
    } else {
        // clearing the roles array if there is anything in it
        roles.splice(0, 0);
        // looping over the results object array
        for (var i = 0; i < results.length; i++) {
            var row = results[i];
            // pushing each result into the roles array
            roles.push(row.role_title);
        }
        return roles;
    }
});

let managers = [];
db.query('SELECT CONCAT(employee_first_name, " ", employee_last_name, " ID: ", employee_id) AS managerInfo FROM employees WHERE manager_id IS NULL', function (err, results) {
    // catching any errors
    if (err) {
        console.error(err);
    } else {
        // clearing the managers array if there is anything in it
        managers.splice(0, 0);
        // looping over the results object array
        for (var i = 0; i < results.length; i++) {
            var row = results[i];
            // pushing each result into the managers array
            managers.push(row.managerInfo);
        }
        return managers;
    }
});

let employees = [];
db.query('SELECT CONCAT(employee_first_name, " ", employee_last_name, " ID: ", employee_id) AS employeeInfo FROM employees', function (err, results) {
    // catching any errors
    if (err) {
        console.error(err);
    } else {
        // clearing the employees array if there is anything in it
        employees.splice(0, 0);
        // looping over the results object array
        for (var i = 0; i < results.length; i++) {
            var row = results[i];
            // pushing each result into the employees array
            employees.push(row.employeeInfo);
        }
        return employees;
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
        name: `newEmployeeFirstName`,
        message: `What is this employee's First Name?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        // validating that a string was given
        validate: newEmployeeFirstName => {
            if (typeof newEmployeeFirstName == 'string' && newEmployeeFirstName.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid first name.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `newEmployeeLastName`,
        message: `What is this employee's Last Name?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        // validating that a string was given
        validate: newEmployeeLastName => {
            if (typeof newEmployeeLastName == 'string' && newEmployeeLastName.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid last name.');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: `newEmployeeRoleId`,
        message: `What is the email address of this intern?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        choices: roles,
        default: 0,
        filter(answer) {
            // fetching the role id based on the role name
            let position = answer.search(/:/);
            let roleRow = answer.substring(0, position);
            return parseInt(roleRow);
        }
    },
    {
        type: 'list',
        name: `newEmployeeManagerId`,
        message: `What is the email address of this intern?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        choices: managers,
        default: 0,
        filter(answer) {
            // fetching the manager id based on the manager name
            let position = answer.search(/:/);
            let managerRow = answer.substring(position + 1);
            return parseInt(managerRow);
        }
    },
    {
        type: 'list',
        name: `updateEmployeeId`,
        message: `Which employee would you like to update?`,
        // only asking this question when the user wants to update an employee role
        when(answers) {
            return answers.proceed === 'Update an Employee Role'
        },
        choices: employees,
        default: 0,
        filter(answer) {
            // fetching the employee id based on the employee name
            let position = answer.search(/:/);
            let employeeRow = answer.substring(position + 1);
            return parseInt(employeeRow);
        }
    },
    {
        type: 'list',
        name: `updateRoleId`,
        message: `Which role would you like to assign this employee?`,
        // only asking this question when the user wants to update an employee role
        when(answers) {
            return answers.proceed === 'Update an Employee Role'
        },
        choices: roles,
        default: 0,
        filter(answer) {
            // fetching the role id based on the role name
            let position = answer.search(/:/);
            let roleRow = answer.substring(0, position);
            return parseInt(roleRow);
        }
    }
]

module.exports = questions;