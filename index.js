const inquirer = require("inquirer");
const { Pool } = require("pg");

// Connect to database
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: process.env.DB_NAME,
});

console.log(`Connected to the company_db database.`);

const askQuestions = () => {
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
        choices: ["A", "B", "C"],
        when: (answers) => answers.purpose == "Add Employee",
      },
      {
        type: "list",
        name: "employeeManager",
        message: "Who is this employee's manager?",
        choices: ["None", "A", "B", "C"],
        when: (answers) => answers.purpose == "Add Employee",
      },
      {
        type: "list",
        name: "employeeName",
        message: "Which employee's role would you like to update?",
        choices: ["A", "B", "C"],
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
        choices: ["A", "B", "C"],
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
      } else if (data.purpose == "Add Employee") {
        // Add
      } else if (data.purpose == "Update Employee Role") {
        // Update
      } else if (data.purpose == "View All Roles") {
        // View
      } else if (data.purpose == "Add Role") {
        // Add
      } else if (data.purpose == "View All Departments") {
        // View
      } else if (data.purpose == "Add Department") {
        // Add
      } else if (data.purpose == "Quit") {
        // Quit
        pool.end();
      }
      if (data.purpose != "Quit") {
        askQuestions();
      }
    })
    .catch((error) => {
      console.error("Error processing input: ", error);
      askQuestions();
    });
};

askQuestions();
