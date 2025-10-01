# An Introduction to PostgreSQL Window Functions

PostgreSQL offers a powerful set of features called **window functions**. For anyone doing data analysis, reporting, or working with complex queries, understanding window functions is a game-changer. They allow you to perform calculations across a set of rows that are related to the current row, without losing the detail of the individual rows.

## What is a Window Function?

Think about a standard aggregate function like `SUM()`, `COUNT()`, or `AVG()`. When you use them with a `GROUP BY` clause, they collapse multiple rows into a single output row.

```sql
-- This query collapses all rows for each department into one row.
SELECT
  department,
  AVG(salary) as avg_salary
FROM employees
GROUP BY department;
```
| department | avg_salary |
|------------|------------|
| Engineering| 85000.00   |
| HR         | 62500.00   |

A **window function**, however, performs a calculation over a "window" of rows (e.g., all rows in the same department) but returns the result on *every single row*. The individual rows are not collapsed.

This allows you to ask questions like:
* "How does each employee's salary compare to the *average salary of their department*?"
* "What is the running total of sales day by day?"
* "Who are the top 3 highest-paid employees in *each* department?"

## The Core Syntax: The `OVER()` Clause

The magic of window functions is enabled by the `OVER()` clause, which defines the "window" of rows the function should operate on.

```sql
function_name() OVER (
  [PARTITION BY expression, ...]
  [ORDER BY expression [ASC|DESC], ...]
)
```

* `function_name()`: The function to apply, like `SUM()`, `AVG()`, `RANK()`, etc.
* `PARTITION BY`: This divides the rows into logical groups or "partitions". The window function is calculated independently for each partition. This is the most important part! It's like a `GROUP BY` for the window function.
* `ORDER BY`: This specifies the order of rows within each partition. This is crucial for functions like `RANK()` or for calculating running totals.

---

## Let's See Some Examples

First, let's set up a sample table to work with.

```sql
-- Create a sample table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary NUMERIC(10, 2)
);

-- Insert some data
INSERT INTO employees (name, department, salary) VALUES
('Alice', 'Engineering', 90000.00),
('Bob', 'Engineering', 80000.00),
('Charlie', 'Engineering', 85000.00),
('Diana', 'HR', 65000.00),
('Eve', 'HR', 60000.00),
('Frank', 'Sales', 75000.00),
('Grace', 'Sales', 80000.00);
```

### Example 1: Average Salary by Department (Without `GROUP BY`)

Let's find the average salary for each department and show it next to each employee's individual salary.

```sql
SELECT
  name,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary
FROM employees;
```

**Result:**

| name    | department  | salary   | dept_avg_salary |
|---------|-------------|----------|-----------------|
| Alice   | Engineering | 90000.00 | 85000.0000      |
| Bob     | Engineering | 80000.00 | 85000.0000      |
| Charlie | Engineering | 85000.00 | 85000.0000      |
| Diana   | HR          | 65000.00 | 62500.0000      |
| Eve     | HR          | 60000.00 | 62500.0000      |
| Frank   | Sales       | 75000.00 | 77500.0000      |
| Grace   | Sales       | 80000.00 | 77500.0000      |

Notice how the `dept_avg_salary` is calculated for each partition (`Engineering`, `HR`, `Sales`) and stamped on every row within that partition. We didn't lose any rows!

### Example 2: Ranking Employees within Each Department

Now, let's rank employees by salary within their respective departments. For this, we need `PARTITION BY` and `ORDER BY`.

```sql
SELECT
  name,
  department,
  salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank
FROM employees;
```

**Result:**

| name    | department  | salary   | salary_rank |
|---------|-------------|----------|-------------|
| Alice   | Engineering | 90000.00 | 1           |
| Charlie | Engineering | 85000.00 | 2           |
| Bob     | Engineering | 80000.00 | 3           |
| Diana   | HR          | 65000.00 | 1           |
| Eve     | HR          | 60000.00 | 2           |
| Grace   | Sales       | 80000.00 | 1           |
| Frank   | Sales       | 75000.00 | 2           |

The ranking restarts for each new department. Alice is #1 in Engineering, and Diana is #1 in HR.

> **Tip:** PostgreSQL also has `DENSE_RANK()` (doesn't skip numbers on ties) and `ROW_NUMBER()` (assigns a unique number to each row).

### Example 3: Calculating a Running Total

Let's calculate a running total of salaries within each department. This shows how `ORDER BY` creates a cumulative calculation.

```sql
SELECT
  name,
  department,
  salary,
  SUM(salary) OVER (PARTITION BY department ORDER BY salary ASC) AS running_total
FROM employees;
```

**Result:**

| name    | department  | salary   | running_total |
|---------|-------------|----------|---------------|
| Bob     | Engineering | 80000.00 | 80000.00      |
| Charlie | Engineering | 85000.00 | 165000.00     |
| Alice   | Engineering | 90000.00 | 255000.00     |
| Eve     | HR          | 60000.00 | 60000.00      |
| Diana   | HR          | 65000.00 | 125000.00     |
| Frank   | Sales       | 75000.00 | 75000.00      |
| Grace   | Sales       | 80000.00 | 155000.00     |

For Bob, the running total is just his salary. For Charlie, it's Bob's + Charlie's. For Alice, it's Bob's + Charlie's + Alice's. The sum restarts when the department changes to HR.

### Example 4: Comparing to the Previous Row (`LAG`)

The `LAG()` function allows you to access data from a previous row in the window. Let's find the salary difference between each employee and the person ranked just below them in the same department.

```sql
SELECT
  name,
  department,
  salary,
  -- Get the salary from the previous row in the window
  LAG(salary, 1, 0) OVER (PARTITION BY department ORDER BY salary DESC) AS previous_salary,
  -- Calculate the difference
  salary - LAG(salary, 1, 0) OVER (PARTITION BY department ORDER BY salary DESC) AS salary_diff
FROM employees;
```

**Result:**

| name    | department  | salary   | previous_salary | salary_diff |
|---------|-------------|----------|-----------------|-------------|
| Alice   | Engineering | 90000.00 | 0.00            | 90000.00    |
| Charlie | Engineering | 85000.00 | 90000.00        | -5000.00    |
| Bob     | Engineering | 80000.00 | 85000.00        | -5000.00    |
| Diana   | HR          | 65000.00 | 0.00            | 65000.00    |
| Eve     | HR          | 60000.00 | 65000.00        | -5000.00    |
| Grace   | Sales       | 80000.00 | 0.00            | 80000.00    |
| Frank   | Sales       | 75000.00 | 80000.00        | -5000.00    |

> The `LAG(column, offset, default_value)` function takes the column to look at, how many rows to go back (`offset`), and a default value if there is no previous row. The `LEAD()` function does the same but looks forward.

## Conclusion

Window functions are an essential tool in your PostgreSQL toolbox. They allow you to write cleaner, more efficient, and more powerful queries for analytical tasks without resorting to complex self-joins or subqueries.

By mastering the `OVER (PARTITION BY ... ORDER BY ...)` clause, you can solve a wide range of common business problems with elegant SQL.

For a complete list of functions, see the official [PostgreSQL documentation on Window Functions](https://www.postgresql.org/docs/current/tutorial-window.html).
