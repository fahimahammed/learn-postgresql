# Mastering PostgreSQL with Common Table Expressions (CTEs)

If you find yourself writing long, nested subqueries that are difficult to read and debug, then **Common Table Expressions (CTEs)** are the feature you need. A CTE allows you to create a temporary, named result set that you can reference within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement.

Think of a CTE as a temporary "view" or a variable that holds the result of a query, available only for the duration of the single statement it belongs to.

## Why Use CTEs?

1.  **Readability**: They break down complex queries into logical, sequential steps, making your SQL much easier to read and understand.
2.  **Reusability**: You can reference the same CTE multiple times within a single query, avoiding the need to write the same subquery over and over.
3.  **Recursion**: CTEs are the only way to write recursive queries in standard SQL, which is essential for working with hierarchical data like organizational charts or bill of materials.

## The Core Syntax: `WITH` Clause

A CTE is defined using the `WITH` keyword at the beginning of your query.

```sql
WITH cte_name AS (
    -- This is the CTE query definition
    SELECT column1, column2 FROM some_table WHERE condition
)
-- This is the main query that uses the CTE
SELECT *
FROM cte_name;
```

You can also chain multiple CTEs together.

```sql
WITH
  cte_1 AS (
    SELECT ...
  ),
  cte_2 AS (
    -- This CTE can even reference the one before it!
    SELECT ... FROM cte_1
  )
SELECT *
FROM cte_2;
```

---

## Let's See Some Examples

First, let's use our `employees` table from the previous guide and add a `departments` table for more interesting scenarios.

```sql
-- (You can skip this if you already have the employees table)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary NUMERIC(10, 2),
    manager_id INT
);

INSERT INTO employees (name, department, salary, manager_id) VALUES
('Alice', 'Engineering', 90000.00, 3),
('Bob', 'Engineering', 80000.00, 3),
('Charlie', 'Engineering', 105000.00, 7),
('Diana', 'HR', 65000.00, 7),
('Eve', 'HR', 60000.00, 4),
('Frank', 'Sales', 75000.00, 8),
('Grace', 'Sales', 80000.00, 8),
('Heidi', 'Management', 120000.00, NULL); -- The CEO


-- Let's add manager info to our employees table
UPDATE employees SET manager_id = 8 WHERE name IN ('Alice', 'Bob');
UPDATE employees SET manager_id = 8 WHERE name = 'Charlie';
UPDATE employees SET manager_id = 8 WHERE name IN ('Diana', 'Eve');
-- Let's define a proper management structure
-- Heidi (8) is CEO
-- Charlie (3) reports to Heidi
-- Diana (4) reports to Heidi
-- Alice (1) and Bob (2) report to Charlie
-- Eve (5) reports to Diana
-- Frank (6) and Grace (7) report to Charlie
TRUNCATE TABLE employees; -- Start fresh for clarity
INSERT INTO employees (id, name, department, salary, manager_id) VALUES
(1, 'Alice',   'Engineering', 90000.00, 3),
(2, 'Bob',     'Engineering', 80000.00, 3),
(3, 'Charlie', 'Engineering', 105000.00, 8),
(4, 'Diana',   'HR',          75000.00, 8),
(5, 'Eve',     'HR',          60000.00, 4),
(6, 'Frank',   'Sales',       75000.00, 3),
(7, 'Grace',   'Sales',       80000.00, 3),
(8, 'Heidi',   'Management',  120000.00, NULL);

```

### Example 1: Improving Readability (Replacing a Subquery)

**Goal**: Find all employees in the 'Engineering' department who earn more than the department's average salary.

**The old way (with a subquery):**

```sql
SELECT
  name,
  salary
FROM employees
WHERE
  department = 'Engineering' AND
  salary > (SELECT AVG(salary) FROM employees WHERE department = 'Engineering');
```
This works, but the subquery is nested and evaluated separately.

**The cleaner way (with a CTE):**

```sql
WITH engineering_stats AS (
  SELECT AVG(salary) as avg_salary
  FROM employees
  WHERE department = 'Engineering'
)
SELECT
  e.name,
  e.salary
FROM
  employees e,
  engineering_stats es
WHERE
  e.department = 'Engineering' AND
  e.salary > es.avg_salary;
```

**Result:**

| name    | salary    |
|---------|-----------|
| Charlie | 105000.00 |

The CTE version separates the logic into two clear steps: first, calculate the average salary for the department; second, use that result to filter the employees.

### Example 2: Chaining Multiple CTEs

**Goal**: Find all 'Sales' employees and show their salary alongside the department's max salary and the total number of employees in that department.

```sql
WITH sales_employees AS (
  -- Step 1: Get all employees in the Sales department
  SELECT
    name,
    salary
  FROM employees
  WHERE department = 'Sales'
),
sales_stats AS (
  -- Step 2: Calculate stats using the first CTE
  SELECT
    MAX(salary) AS max_salary,
    COUNT(*) AS num_employees
  FROM sales_employees
)
-- Step 3: Combine the results
SELECT
  se.name,
  se.salary,
  ss.max_salary,
  ss.num_employees
FROM
  sales_employees se,
  sales_stats ss;
```

**Result:**

| name  | salary   | max_salary | num_employees |
|-------|----------|------------|---------------|
| Frank | 75000.00 | 80000.00   | 2             |
| Grace | 80000.00 | 80000.00   | 2             |

This demonstrates how you can build a logical pipeline where each step is a simple, easy-to-understand CTE.

### Example 3: The Power of Recursion

This is the most powerful feature of CTEs. We can use them to query hierarchical data, like an organizational chart.

**Goal**: Find all employees who report to Charlie (ID 3), directly or indirectly.

We need a `RECURSIVE` CTE. It has two parts:
1.  **Base Case**: The starting point of the recursion (Charlie's direct reports).
2.  **Recursive Step**: The part that joins back to the CTE to find the next level of the hierarchy (the reports of the reports).

```sql
WITH RECURSIVE subordinates AS (
  -- 1. Base Case: Find the direct reports of Charlie (manager_id = 3)
  SELECT
    id,
    name,
    manager_id,
    1 as level -- Start at level 1
  FROM employees
  WHERE manager_id = 3

  UNION ALL

  -- 2. Recursive Step: Join employees with the CTE to find the next level
  SELECT
    e.id,
    e.name,
    e.manager_id,
    s.level + 1
  FROM employees e
  INNER JOIN subordinates s ON e.manager_id = s.id -- Key recursive join
)
SELECT
  name,
  level
FROM subordinates;
```

**Result:**

| name  | level |
|-------|-------|
| Alice | 1     |
| Bob   | 1     |
| Frank | 1     |
| Grace | 1     |

In this structure, Charlie has no one reporting to his direct reports, so the recursion stops after one level. If Alice (ID 1) managed someone, they would appear at `level` 2.

## Conclusion

Common Table Expressions are a fundamental tool for writing modern, maintainable SQL. They turn messy, nested subqueries into clean, logical workflows.

* Use them to **simplify complex queries**.
* Use them to **avoid repeating yourself**.
* Use `WITH RECURSIVE` to **tackle hierarchical data** with ease.

Once you get comfortable with CTEs, you'll find it hard to go back to writing complex queries any other way.

For more details, see the official [PostgreSQL documentation on `WITH` Queries (CTEs)](https://www.postgresql.org/docs/current/queries-with.html).
