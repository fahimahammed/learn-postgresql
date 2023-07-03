```sql
-- Create a table named department
CREATE TABLE department (
    dept_name VARCHAR(100) PRIMARY KEY,
    building VARCHAR(120) NOT NULL,
    budget NUMERIC(12,2) NOT NULL DEFAULT 'undecided',
    num_staff INT
);

-- Insert values into the department table
INSERT INTO department (dept_name, building, budget, num_staff)
VALUES ('cse', 'ma wazed', 12.20, 10),
       ('cse', 'ma wazed', 12.20, 10),
       ('cse', 'ma wazed', 12.20, 10);

-- Add a column named dept_code to the existing department table
ALTER TABLE department ADD COLUMN dept_code VARCHAR(6) NOT NULL;

-- Add a column named dep_code to the existing department table after the dept_name column
ALTER TABLE department ADD COLUMN dep_code VARCHAR(6) NOT NULL AFTER dept_name;

-- Remove the dept_code column from the department table
ALTER TABLE department DROP COLUMN dept_code;

-- Modify the data type of the dept_code column to VARCHAR(10) in the department table
ALTER TABLE department ALTER COLUMN dept_code TYPE VARCHAR(10);

-- Delete the department table along with its structure
DROP TABLE department;

-- Delete all data from the department table, keeping the table structure
DELETE FROM department;
-- OR
TRUNCATE department;

-- Insert values into a table (TABLE2) from another table (TABLE1) based on a condition
INSERT INTO TABLE2 (employeeId, employeeName)
SELECT id, firstName FROM TABLE1 WHERE CONDITION;

-- Update the salary column of the instructor table by increasing it by 5% for instructors with salary below the average salary
UPDATE instructor
SET salary = salary * 1.05
WHERE salary < (SELECT AVG(salary) FROM instructor);

-- Update the salary column of the instructor table using a case statement
UPDATE instructor
SET salary = CASE
    WHEN salary <= 100000 THEN salary * 1.05
    ELSE salary * 1.03
END;

-- Retrieve records from the instructor table and order the results by dept_name in descending order and salary in ascending order
SELECT *
FROM instructor
ORDER BY dept_name DESC, salary ASC;

-- Retrieve a limited number of rows from a table
SELECT *
FROM TABLE_NAME
LIMIT n;

-- Retrieve a limited number of rows from a table, starting from the mth row
SELECT *
FROM TABLE_NAME
LIMIT n OFFSET m;

-- Retrieve records from the instructor table where the name is not 'pranto' or 'Zahid'
SELECT *
FROM instructor
WHERE name NOT IN ('pranto', 'Zahid');

-- Retrieve records from the instructor table where the id is within a range
SELECT *
FROM instructor
WHERE id IN (SELECT id FROM instructor WHERE id < 500);

-- Retrieve records from the instructor table where the salary is between 5000 and 10000
SELECT sname
FROM instructor
WHERE salary BETWEEN 5000 AND 10000;

-- Retrieve records from the instructor table where the salary is NULL
SELECT *
FROM instructor
WHERE salary IS NULL;

-- Retrieve records from the instructor table where the id ends with '5' followed by any character
SELECT *
FROM instructor
WHERE id LIKE '%5_';

-- Find the average salary of instructors in the CSE department
SELECT AVG(salary)
FROM instructor
WHERE dept_name = 'CSE';

-- Find the number of departments in the instructor relation
SELECT COUNT(DISTINCT dept_name)
FROM instructor;

-- Find the number of tuples (rows) in the instructor relation
SELECT COUNT(*) AS num_rows
FROM instructor;

-- Retrieve the department name and the average salary of instructors for each department
SELECT dept_name, AVG(salary) AS avg_salary
FROM instructor
GROUP BY dept_name;

-- Retrieve the department name and the number of instructors in each department
SELECT dept_name, COUNT(id) AS num_of_teacher
FROM instructor
GROUP BY dept_name;

-- Perform a natural join between the employee and branch tables
SELECT branch_name, first_name, last_name
FROM employee
[LEFT|RIGHT] JOIN branch
ON employee.emp_id = branch.mgr_id;

-- Perform a nested query to retrieve employee names based on their IDs in the works_with table
SELECT employee.first_name, employee.last_name
FROM employee
WHERE employee.emp_id IN (
    SELECT emp_id
    FROM works_with
    WHERE total_sales > 30000
);

-- Create a trigger that inserts values into another table when a new row is inserted into table1
CREATE OR REPLACE FUNCTION triggertest()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO table2 VALUES (NEW.id, NEW.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER my_trigger
BEFORE INSERT ON table1
FOR EACH ROW
EXECUTE FUNCTION triggertest();

-- Create a trigger with conditional statements that inserts values into another table based on the sex column in the employee table
CREATE OR REPLACE FUNCTION my_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sex = 'M' THEN
        INSERT INTO trigger_test VALUES ('added male employee');
    ELSIF NEW.sex = 'F' THEN
        INSERT INTO trigger_test VALUES ('added female');
    ELSE
        INSERT INTO trigger_test VALUES ('added other employee');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER my_trigger
BEFORE INSERT ON employee
FOR EACH ROW
EXECUTE FUNCTION my_trigger();

-- Example of a complex query involving multiple tables and joins
SELECT t.eName
FROM (
    SELECT *
    FROM employee
    NATURAL JOIN manages
) AS t
INNER JOIN employee AS e
ON t.mName = e.eName
AND t.city = e.city
AND t.street = e.street;

```