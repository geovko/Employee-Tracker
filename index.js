const inquirer = require("inquirer");
const { Pool } = require("pg");
require("dotenv").config();

// Connect to database
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: process.env.DB_NAME,
  port: 3306,
});

console.log(`Connected to the company_db database.`);

const askQuestions = async () => {
  let roleList;
  let employeeList;
  let departmentList;
  try {
    const result = await pool.query(`SELECT roles.title FROM roles`);
    roleList = result.rows.map((row) => row.title);
  } catch (error) {
    console.error("Database query error: ", error);
  }

  try {
    const result = await pool.query(
      `SELECT CONCAT(employees.first_name, ' ', employees.last_name) FROM employees`
    );
    employeeList = result.rows.map((row) => row.concat);
  } catch (error) {
    console.error("Database query error: ", error);
  }

  try {
    const result = await pool.query(`SELECT departments.name FROM departments`);
    departmentList = result.rows.map((row) => row.name);
  } catch (error) {
    console.error("Database query error: ", error);
  }

  inquirer
    .prompt([
      {
        type: "list",
        name: "purpose",
        message: "what would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
      {
        type: "input",
        name: "employeeFirstName",
        message: "What is the employee's first name?",
        when: (answers) => answers.purpose == "Add Employee",
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "What is the employee's last name?",
        when: (answers) => answers.purpose == "Add Employee",
      },
      {
        type: "list",
        name: "employeeRole",
        message: "What is the employee's role?",
        choices: roleList,
        when: (answers) => answers.purpose == "Add Employee",
      },
      {
        type: "list",
        name: "employeeManager",
        message: "Who is this employee's manager?",
        choices: employeeList,
        when: (answers) => answers.purpose == "Add Employee",
      },
      {
        type: "list",
        name: "employeeName",
        message: "Which employee's role would you like to update?",
        choices: employeeList,
        when: (answers) => answers.purpose == "Update Employee Role",
      },
      {
        type: "input",
        name: "employeeNewRole",
        message: "What is the employee's new role?",
        when: (answers) => answers.purpose == "Update Employee Role",
      },
      {
        type: "input",
        name: "roleName",
        message: "What is the name of the role?",
        when: (answers) => answers.purpose == "Add Role",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the role?",
        when: (answers) => answers.purpose == "Add Role",
      },
      {
        type: "list",
        name: "roleDepartment",
        message: "Which department does the role belong to?",
        choices: departmentList,
        when: (answers) => answers.purpose == "Add Role",
      },
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
        when: (answers) => answers.purpose == "Add Department",
      },
    ])
    .then((data) => {
      if (data.purpose == "View All Employees") {
        // View
        const sql = `SELECT e.id, 
          e.first_name AS first, 
          e.last_name AS last, 
          r.title AS role, 
          r.salary AS salary, 
          d.name AS department,
          CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM employees e
          JOIN roles r ON e.role_id = r.id
          JOIN departments d ON r.department_id = d.id
          LEFT JOIN employees m ON e.manager_id=m.id`;

        pool.query(sql, (err, res) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          } else {
            console.table(res.rows);
          }
          askQuestions();
        });
      } else if (data.purpose == "Add Employee") {
        // Add
        askQuestions();
      } else if (data.purpose == "Update Employee Role") {
        // Update
        askQuestions();
      } else if (data.purpose == "View All Roles") {
        // View
        const sql = `SELECT * FROM roles`;
        pool.query(sql, (err, res) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          } else {
            console.log("\nRoles");
            console.table(res.rows);
          }
          askQuestions();
        });
      } else if (data.purpose == "Add Role") {
        // Add
        askQuestions();
      } else if (data.purpose == "View All Departments") {
        // View
        const sql = `SELECT * FROM departments`;
        pool.query(sql, (err, res) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          } else {
            console.log("\nDepartments");
            console.table(res.rows);
          }
          askQuestions();
        });
      } else if (data.purpose == "Add Department") {
        // Add
        askQuestions();
      } else if (data.purpose == "Quit") {
        // Quit
        pool.end();
      }
    })
    .catch((error) => {
      console.error("Error processing input: ", error);
      askQuestions();
    });
};

askQuestions();
