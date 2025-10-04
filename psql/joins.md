# PostgreSQL Joins
## Sample Tables

Let's use these sample tables for illustration:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name TEXT,
    manager_id INTEGER
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    dept_name TEXT,
    manager_id INTEGER
);
```

Sample data:

```sql
INSERT INTO employees (name, manager_id) VALUES
('Alice', NULL),
('Bob', 1),
('Charlie', 1),
('Diana', 2);

INSERT INTO departments (dept_name, manager_id) VALUES
('HR', 1),
('Engineering', 2),
('Marketing', 3);
```

## Examples

**INNER JOIN:** List employees and their department if they are a manager.

```sql
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.id = d.manager_id;
```

**LEFT JOIN:** List all employees and their department (if any).

```sql
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.id = d.manager_id;
```

**RIGHT JOIN:** List all departments and their manager (if any).

```sql
SELECT d.dept_name, e.name AS manager
FROM departments d
RIGHT JOIN employees e ON d.manager_id = e.id;
```

**FULL JOIN:** Show all employees and departments, matching managers where possible.

```sql
SELECT e.name, d.dept_name
FROM employees e
FULL JOIN departments d ON e.id = d.manager_id;
```

**CROSS JOIN:** Every employee with every department.

```sql
SELECT e.name, d.dept_name
FROM employees e
CROSS JOIN departments d;
```

**SELF JOIN:** List employees and their managers.

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id;
```
Joins in PostgreSQL allow you to combine rows from two or more tables based on related columns. This is essential for querying relational data efficiently.

## Types of Joins

### 1. INNER JOIN

Returns rows when there is a match in both tables.

```sql
SELECT a.*, b.*
FROM table_a a
INNER JOIN table_b b ON a.id = b.a_id;
```

### 2. LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from the left table, and matched rows from the right table. Unmatched rows from the right table will have NULLs.

```sql
SELECT a.*, b.*
FROM table_a a
LEFT JOIN table_b b ON a.id = b.a_id;
```

### 3. RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from the right table, and matched rows from the left table. Unmatched rows from the left table will have NULLs.

```sql
SELECT a.*, b.*
FROM table_a a
RIGHT JOIN table_b b ON a.id = b.a_id;
```

### 4. FULL JOIN (FULL OUTER JOIN)

Returns all rows when there is a match in one of the tables. Unmatched rows will have NULLs for columns from the other table.

```sql
SELECT a.*, b.*
FROM table_a a
FULL JOIN table_b b ON a.id = b.a_id;
```

### 5. CROSS JOIN

Returns the Cartesian product of both tables (every row of the first table with every row of the second table).

```sql
SELECT a.*, b.*
FROM table_a a
CROSS JOIN table_b b;
```

### 6. SELF JOIN

A table joined with itself.

```sql
SELECT a.*, b.*
FROM employees a
INNER JOIN employees b ON a.manager_id = b.id;
```

## Join Conditions

- Use `ON` to specify the join condition.
- You can join on multiple columns:

```sql
SELECT *
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id AND o.region = c.region;
```

## Practical Example

Suppose you have two tables:

```sql
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT,
    author_id INTEGER REFERENCES authors(id)
);
```

**Get all books with their authors:**

```sql
SELECT books.title, authors.name
FROM books
INNER JOIN authors ON books.author_id = authors.id;
```

**Get all authors and their books (including authors with no books):**

```sql
SELECT authors.name, books.title
FROM authors
LEFT JOIN books ON authors.id = books.author_id;
```

## Tips

- Use table aliases for readability.
- Always specify join conditions to avoid Cartesian products (except for CROSS JOIN).
- Use `USING(column)` for joins on columns with the same name.

```sql
SELECT *
FROM table_a
INNER JOIN table_b USING (id);
```

## References

- [PostgreSQL Documentation: Joins](https://www.postgresql.org/docs/current/tutorial-inheritance.html)
- [PostgreSQL SELECT](https://www.postgresql.org/docs/current/sql-select.html)
