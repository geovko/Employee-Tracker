INSERT INTO departments (name)
VALUES ('Happiness'),
       ('Sadness'),
       ('Fear'),
       ('Fury'),
       ('Excitement');
       
INSERT INTO roles (title, salary, department_id)
VALUES ('Laughing', 200, 001),
       ('Smiling', 300, 001),
       ('Crying', 400, 002),
       ('Shivering', 100, 003),
       ('Burning', 150, 004),
       ('Exploding', 100, 004),
       ('Jumping', 500, 005);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Billy', 'Bob', 001, null),
       ('Piddly', 'Pod', 002, null),
       ('Samantha', 'Samms', 003, null),
       ('Zamantha', 'Zamms', 003, 007),
       ('Zi', 'Zierro', 004, 007),
       ('Edna', 'Claris', 005, null),
       ('Belvis', 'Videt', 006, null),
       ('Elvis', 'Idet', 006, 007),
       ('Angie', 'Tiao', 007, null);