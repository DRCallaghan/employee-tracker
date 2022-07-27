-- for within questions.js when adding employee
db.query('SELECT CONCAT(employee_first_name, " ", employee_last_name) FROM employees WHERE manager_id IS NULL')
