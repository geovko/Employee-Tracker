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
  let managerList;
  let departmentList;

  // Get a list of roles
  try {
    const result = await pool.query(`SELECT roles.title FROM roles`);
    roleList = result.rows.map((row) => row.title);
  } catch (error) {
    console.error("Database query error: ", error);
  }

  // Get a list of employees and managers
  try {
    const result = await pool.query(
      `SELECT CONCAT(employees.first_name, ' ', employees.last_name) FROM employees`
    );
    employeeList = result.rows.map((row) => row.concat);
    managerList = ["None", ...employeeList];
  } catch (error) {
    console.error("Database query error: ", error);
  }

  // Get a list of departments
  try {
    const result = await pool.query(`SELECT departments.name FROM departments`);
    departmentList = result.rows.map((row) => row.name);
  } catch (error) {
    console.error("Database query error: ", error);
  }

  const data = await inquirer.prompt([
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
      choices: managerList,
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
      type: "list",
      name: "employeeNewRole",
      message: "What is the employee's new role?",
      choices: roleList,
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
  ]);

  if (data.purpose == "View All Employees") {
    // VIEW EMPLOYEES ===================================
    const sql = `SELECT e.id, 
        e.first_name AS first, 
        e.last_name AS last, 
        r.title AS role, 
        d.name AS department,
        r.salary AS salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employees e
        JOIN roles r ON e.role_id = r.id
        JOIN departments d ON r.department_id = d.id
        LEFT JOIN employees m ON e.manager_id = m.id`;
    try {
      const res = await pool.query(sql);
      console.table(res.rows);
    } catch (err) {
      console.error("Error viewing employees: ", err);
      return;
    }

    askQuestions();
  } else if (data.purpose == "Add Employee") {
    // ADD EMPLOYEE ======================================
    let managerId = null;
    let roleId;

    // Get manager id
    if (data.employeeManager != "None") {
      const firstName = data.employeeManager.split(" ");
      const findManager = `SELECT id FROM employees WHERE first_name = $1`;
      try {
        const res = await pool.query(findManager, [firstName[0]]);
        managerId = res.rows[0].id;
      } catch (err) {
        console.error("Error finding Manager_Id: ", err);
        return;
      }
    }

    // Get role id
    const findRole = `SELECT id FROM roles WHERE title = $1`;
    try {
      const res = await pool.query(findRole, [data.employeeRole]);
      roleId = res.rows[0].id;
    } catch (err) {
      console.error("Error finding Role_Id: ", err);
      return;
    }

    // Insert employee
    const addEmployee = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
    const params = [
      data.employeeFirstName,
      data.employeeLastName,
      roleId,
      managerId,
    ];

    try {
      await pool.query(addEmployee, params);
    } catch (err) {
      console.error("Error adding employee: ", err);
    }

    askQuestions();
  } else if (data.purpose == "Update Employee Role") {
    // UPDATE EMPLOYEE ROLE ==============================
    let employeeId;
    let roleId;

    // Get employee id
    const firstName = data.employeeName.split(" ");
    const findEmployee = `SELECT id FROM employees WHERE first_name = $1`;
    try {
      const res = await pool.query(findEmployee, [firstName[0]]);
      employeeId = res.rows[0].id;
    } catch (err) {
      console.error("Error finding Employee Id: ", err);
      return;
    }

    // Get new role id
    const findRole = `SELECT id FROM roles WHERE title = $1`;
    try {
      const res = await pool.query(findRole, [data.employeeNewRole]);
      roleId = res.rows[0].id;
    } catch (err) {
      console.error("Error finding Role_Id: ", err);
      return;
    }

    // Update role id
    const sql = `UPDATE employees SET role_id = $1 WHERE id = $2`;
    const params = [roleId, employeeId];
    try {
      await pool.query(sql, params);
    } catch (err) {
      console.error("Error updating Role_Id: ", err);
    }

    askQuestions();
  } else if (data.purpose == "View All Roles") {
    // VIEW ROLES ========================================
    const sql = `SELECT r.id,
        r.title,
        d.name AS department,
        r.salary
        FROM roles r 
        JOIN departments d ON r.department_id = d.id`;
    try {
      const res = await pool.query(sql);
      console.table(res.rows);
    } catch (err) {
      console.error("Error viewing roles: ", err);
      return;
    }

    askQuestions();
  } else if (data.purpose == "Add Role") {
    // ADD ROLE ==========================================
    let departmentId;

    // Get department id
    const findDepartment = `SELECT id FROM departments WHERE name = $1`;
    try {
      const res = await pool.query(findDepartment, [data.roleDepartment]);
      departmentId = res.rows[0].id;
    } catch (err) {
      console.error("Error finding Department_Id: ", err);
      return;
    }

    // Insert role
    const addRole = `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`;
    const params = [data.roleName, data.roleSalary, departmentId];
    try {
      await pool.query(addRole, params);
    } catch (err) {
      console.error("Error adding role: ", err);
    }

    askQuestions();
  } else if (data.purpose == "View All Departments") {
    // VIEW DEPARTMENTS ==================================
    const sql = `SELECT * FROM departments`;
    try {
      const res = await pool.query(sql);
      console.table(res.rows);
    } catch (err) {
      console.error("Error viewing departments: ", err);
      return;
    }

    askQuestions();
  } else if (data.purpose == "Add Department") {
    // ADD DEPARTMENT ====================================

    // Insert department
    const addDepartment = `INSERT INTO departments (name) VALUES ($1)`;
    const param = [data.department];
    try {
      await pool.query(addDepartment, param);
    } catch (err) {
      console.error("Error adding department: ", err);
    }

    askQuestions();
  } else if (data.purpose == "Quit") {
    // QUIT ==============================================
    pool.end();
  }
};

askQuestions();
