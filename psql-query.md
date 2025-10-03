```sql
-- 1. Create a table named department
CREATE TABLE department (
    dept_name VARCHAR(100) PRIMARY KEY,
    building VARCHAR(120) NOT NULL,
    budget NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    num_staff INT
);

-- 2. Insert unique values into the department table
INSERT INTO department (dept_name, building, budget, num_staff)
VALUES ('CSE', 'MA Wazed', 12000.00, 10),
       ('EEE', 'Main Building', 15000.00, 8),
       ('ME', 'Workshop Block', 13000.00, 12);

-- 3. Add new columns with default values
ALTER TABLE department ADD COLUMN dep_code VARCHAR(15) DEFAULT 'NA';

-- 4. Insert values into another table from a table
-- Make sure employee_archive exists
INSERT INTO employee_archive (employeeId, employeeName)
SELECT emp_id, first_name
FROM employee
WHERE salary > 50000;

-- 5. Update instructor salary below average by 5%
UPDATE instructor
SET salary = salary * 1.05
WHERE salary < (SELECT AVG(salary) FROM instructor);

-- 6. Update salary using CASE
UPDATE instructor
SET salary = CASE
    WHEN salary <= 100000 THEN salary * 1.05
    ELSE salary * 1.03
END;

-- 7. Select instructors ordered by dept_name DESC, salary ASC
SELECT *
FROM instructor
ORDER BY dept_name DESC, salary ASC;

-- 8. Retrieve limited rows
SELECT *
FROM instructor
LIMIT 5;  -- first 5 rows

-- 9. Retrieve rows with offset
SELECT *
FROM instructor
LIMIT 5 OFFSET 10;  -- rows 11-15

-- 10. Select where name not in list
SELECT *
FROM instructor
WHERE name NOT IN ('Pranto', 'Zahid');

-- 11. Select where id is within a subquery
SELECT *
FROM instructor
WHERE id IN (SELECT id FROM instructor WHERE id < 500);

-- 12. Select salary between 5000 and 10000
SELECT sname
FROM instructor
WHERE salary BETWEEN 5000 AND 10000;

-- 13. Select rows where salary is NULL
SELECT *
FROM instructor
WHERE salary IS NULL;

-- 14. Select id ending with '5' and any character
SELECT *
FROM instructor
WHERE id::TEXT LIKE '%5_';

-- 15. Average salary of CSE department
SELECT AVG(salary) AS avg_salary
FROM instructor
WHERE dept_name = 'CSE';

-- 16. Number of distinct departments
SELECT COUNT(DISTINCT dept_name) AS num_departments
FROM instructor;

-- 17. Number of rows in instructor table
SELECT COUNT(*) AS num_rows
FROM instructor;

-- 18. Department name and average salary
SELECT dept_name, AVG(salary) AS avg_salary
FROM instructor
GROUP BY dept_name;

-- 19. Department name and number of instructors
SELECT dept_name, COUNT(id) AS num_of_teacher
FROM instructor
GROUP BY dept_name;

-- 20. Join example: LEFT JOIN employee and branch
SELECT branch.branch_name, employee.first_name, employee.last_name
FROM employee
LEFT JOIN branch
ON employee.emp_id = branch.mgr_id;

-- 21. Nested query example
SELECT employee.first_name, employee.last_name
FROM employee
WHERE employee.emp_id IN (
    SELECT emp_id
    FROM works_with
    WHERE total_sales > 30000
);

-- 22. Trigger example: insert into table2 when a row is inserted in table1
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

-- 23. Trigger with conditional logic
CREATE OR REPLACE FUNCTION sex_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sex = 'M' THEN
        INSERT INTO trigger_test VALUES ('added male employee');
    ELSIF NEW.sex = 'F' THEN
        INSERT INTO trigger_test VALUES ('added female employee');
    ELSE
        INSERT INTO trigger_test VALUES ('added other employee');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER my_sex_trigger
BEFORE INSERT ON employee
FOR EACH ROW
EXECUTE FUNCTION sex_trigger();

-- 24. Complex query: explicit JOIN instead of NATURAL JOIN
SELECT e1.eName
FROM manages m
INNER JOIN employee e1 ON m.emp_id = e1.emp_id
INNER JOIN employee e2 ON m.mName = e2.eName
    AND m.city = e2.city
    AND m.street = e2.street;
