# PostgreSQL Beginner Interview Questions and Answers

This document contains a set of 30 beginner-friendly PostgreSQL questions along with detailed answers. These questions are suitable for interview preparation.

---

## 1. What is PostgreSQL?
**Answer:**
PostgreSQL is an open-source, object-relational database management system (ORDBMS) that supports both SQL (relational) and JSON (non-relational) querying. It is highly extensible, reliable, and supports advanced data types.

---

## 2. How do you create a new database in PostgreSQL?
**Answer:**
```sql
CREATE DATABASE my_database;
```

---

## 3. How do you list all databases in PostgreSQL?
**Answer:**
```sql
\l
-- or using SQL
SELECT datname FROM pg_database;
```

---

## 4. How do you connect to a specific database?
**Answer:**
```sql
\c my_database
```

---

## 5. How do you create a table in PostgreSQL?
**Answer:**
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT CHECK (age > 0),
    department VARCHAR(50)
);
```
- `SERIAL` automatically generates a unique number for `id`.
- `CHECK` enforces constraints on data integrity.

---

## 6. How do you insert data into a table?
**Answer:**
```sql
INSERT INTO employees (name, age, department)
VALUES ('John Doe', 30, 'IT');
```

---

## 7. How do you retrieve all data from a table?
**Answer:**
```sql
SELECT * FROM employees;
```

---

## 8. How do you retrieve specific columns from a table?
**Answer:**
```sql
SELECT name, department FROM employees;
```

---

## 9. How do you update data in a table?
**Answer:**
```sql
UPDATE employees
SET department = 'HR'
WHERE name = 'John Doe';
```
- `WHERE` clause ensures only the intended row(s) are updated.

---

## 10. How do you delete data from a table?
**Answer:**
```sql
DELETE FROM employees
WHERE name = 'John Doe';
```

---

## 11. How do you add a new column to an existing table?
**Answer:**
```sql
ALTER TABLE employees
ADD COLUMN salary NUMERIC(10,2);
```
- `NUMERIC(10,2)` stores numbers with 10 digits total and 2 decimal places.

---

## 12. How do you remove a column from a table?
**Answer:**
```sql
ALTER TABLE employees
DROP COLUMN salary;
```

---

## 13. How do you rename a column?
**Answer:**
```sql
ALTER TABLE employees
RENAME COLUMN department TO dept;
```

---

## 14. How do you rename a table?
**Answer:**
```sql
ALTER TABLE employees
RENAME TO staff;
```

---

## 15. How do you create an index on a column?
**Answer:**
```sql
CREATE INDEX idx_name ON employees(name);
```
- Indexes improve query performance on frequently searched columns.

---

## 16. What is the difference between `CHAR`, `VARCHAR`, and `TEXT`?
**Answer:**
- `CHAR(n)`: Fixed-length string, pads with spaces if less than n characters.  
- `VARCHAR(n)`: Variable-length string with a maximum limit of n characters.  
- `TEXT`: Variable-length string with no maximum limit.

---

## 17. How do you find all employees older than 25?
**Answer:**
```sql
SELECT * FROM employees
WHERE age > 25;
```

---

## 18. How do you sort query results by a column in ascending order?
**Answer:**
```sql
SELECT * FROM employees
ORDER BY age ASC;
```

---

## 19. How do you sort query results in descending order?
**Answer:**
```sql
SELECT * FROM employees
ORDER BY age DESC;
```

---

## 20. How do you count the number of rows in a table?
**Answer:**
```sql
SELECT COUNT(*) FROM employees;
```

---

## 21. How do you find the maximum and minimum age?
**Answer:**
```sql
SELECT MAX(age) AS max_age, MIN(age) AS min_age
FROM employees;
```

---

## 22. How do you calculate the average age?
**Answer:**
```sql
SELECT AVG(age) AS average_age FROM employees;
```

---

## 23. How do you find unique departments?
**Answer:**
```sql
SELECT DISTINCT department FROM employees;
```

---

## 24. How do you filter records using multiple conditions?
**Answer:**
```sql
SELECT * FROM employees
WHERE age > 25 AND department = 'IT';
```

---

## 25. How do you use the `LIKE` operator?
**Answer:**
```sql
SELECT * FROM employees
WHERE name LIKE 'J%'; -- Names starting with J
```

---

## 26. How do you use `IN` to filter specific values?
**Answer:**
```sql
SELECT * FROM employees
WHERE department IN ('IT', 'HR');
```

---

## 27. How do you use `BETWEEN` to filter a range?
**Answer:**
```sql
SELECT * FROM employees
WHERE age BETWEEN 25 AND 35;
```

---

## 28. How do you join two tables?
**Answer:**
```sql
SELECT e.name, d.name AS dept_name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```
- `JOIN` combines rows from two tables based on a related column.

---

## 29. How do you group data?
**Answer:**
```sql
SELECT department, COUNT(*) AS total_employees
FROM employees
GROUP BY department;
```
- `GROUP BY` aggregates rows with the same column value.

---

## 30. How do you delete a table?
**Answer:**
```sql
DROP TABLE employees;
```

---
## 31. What is the difference between SERIAL and BIGSERIAL?
**Answer:**
SERIAL: Auto-incrementing integer (4 bytes), range up to ~2 billion.
BIGSERIAL: Auto-incrementing big integer (8 bytes), range up to ~9 quintillion.

---
## 32. How do you create a foreign key?
**Answer:**
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    order_date DATE
);
```

---
## 33. How do you limit the number of rows returned?
**Answer:**
```sql
SELECT * FROM employees LIMIT 5;
```

---
## 34. How do you skip rows using OFFSET?
**Answer:**
```sql
SELECT * FROM employees
LIMIT 5 OFFSET 10;
```

---
## 35. How do you combine results from two queries?
**Answer:**
```sql
SELECT name FROM employees
UNION
SELECT name FROM managers;
```

---
## 36. How do you check the structure of a table?
**Answer:**
```sql
\d employees
```

---
## 37. How do you find the current database?
**Answer:**
```sql
SELECT current_database();
```

---
## 38. How do you find the current user?
**Answer:**
```sql
SELECT current_user;
```

---
## 39. How do you concatenate strings?
**Answer:**
```sql
SELECT first_name || ' ' || last_name AS full_name
FROM employees;
```

---
## 40. How do you use CASE statements in queries?
**Answer:**
```sql
SELECT name,
       CASE 
           WHEN age < 30 THEN 'Young'
           ELSE 'Experienced'
       END AS age_group
FROM employees;
```

---

