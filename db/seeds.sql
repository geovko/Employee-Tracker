INSERT INTO departments (name)
VALUES ('Design'),
       ('Marketing'),
       ('Planning'),
       ('Finance'),
       ('Fun');
       
INSERT INTO roles (title, salary, department_id)
VALUES ('Web Designer', 200, 001),
       ('Visonary', 300, 001),
       ('The Talker', 400, 002),
       ('The Planner', 100, 003),
       ('Accountant', 150, 004),
       ('Calculator', 100, 004),
       ('Party-Starter', 500, 005);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Billy', 'Bob', 001, 005),
       ('Piddly', 'Pop', 002, 005),
       ('Samantha', 'Samms', 003, null),
       ('Zamantha', 'Zamms', 003, null),
       ('Zi', 'Zierro', 004, null),
       ('Edna', 'Claris', 005, null),
       ('Belvis', 'Videt', 006, 006),
       ('Elvis', 'Idet', 006, 006),
       ('Sassafras', 'Topeka', 007, null);