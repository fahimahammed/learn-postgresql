# Clauses in PostgreSQL
SQL clauses are used in PostgreSQL to perform various operations and manipulate data in the database. Clauses are keywords or statements that are incorporated into SQL queries to specify conditions, filters, sorting, grouping, and other operations.

## Table of Contents
- [WHERE Clause](#where-clause)
- [AND and OR Operators](#and-and-or-operators)
- [LIKE Operator](#like-operator)
- [LIMIT Clause](#limit-clause)
- [ORDER BY Clause](#order-by-clause)
- [GROUP BY Clause](#group-by-clause)
- [WITH Clause](#with-clause)
- [HAVING Clause](#having-clause)

## WHERE Clause:
Filters the rows based on specified conditions.
Syntax:
```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```
Example: Retrieve all customers whose age is greater than 25.
```sql
SELECT * FROM customers WHERE age > 25;
```

## AND and OR Operators
Allows combining multiple conditions in a WHERE clause.
Syntax:
```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition1 AND/OR condition2;
```
Example: Retrieve all customers whose age is greater than 25 and have a subscription.
```sql
SELECT * FROM customers WHERE age > 25 AND subscription = true;
```

## LIKE Operator
Performs pattern matching on a column value.
Syntax:
```sql
SELECT column1, column2, ...
FROM table_name
WHERE column_name LIKE pattern;
```

Example: Retrieve all products with names starting with "A".
```sql
SELECT * FROM products WHERE name LIKE 'A%';
```

## LIMIT Clause
Limits the number of rows returned by a query.
Syntax:
```sql
SELECT column1, column2, ...
FROM table_name
LIMIT limit_value;
```

Example: Retrieve the first 5 customers from the table.
```sql
SELECT * FROM customers LIMIT 5;
```

## ORDER BY Clause
Sorts the result set based on specified columns.
Syntax:
```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1, column2, ... ASC/DESC;
```

Example: Retrieve all products sorted by price in descending order.
```sql
SELECT * FROM products ORDER BY price DESC;
```

## GROUP BY Clause
Groups the rows based on specified columns.
Syntax:
```sql
SELECT column1, aggregate_function(column2)
FROM table_name
GROUP BY column1;
```

Example: Retrieve the total sales amount for each product category.
```sql
SELECT category, SUM(sales_amount) FROM sales GROUP BY category;
```

## WITH Clause
Creates a temporary named result set that can be used in subsequent queries.
Syntax:
```sql
WITH cte_name AS (
  SELECT column1, column2, ...
  FROM table_name
  WHERE condition
)
SELECT * FROM cte_name;
```
Example: Retrieve the employees and their corresponding departments using a CTE.
```sql
WITH employee_departments AS (
  SELECT employees.name, departments.department_name
  FROM employees
  JOIN departments ON employees.department_id = departments.department_id
)
SELECT * FROM employee_departments;
```

## HAVING Clause
Filters the grouped rows based on specified conditions.
Syntax:
```sql
SELECT column1, aggregate_function(column2)
FROM table_name
GROUP BY column1
HAVING condition;
```

Example: Retrieve product categories with total sales amount greater than 1000.
```sql
SELECT category, SUM(sales_amount)
FROM products
GROUP BY category
HAVING SUM(sales_amount) > 1000;
```


These clauses are fundamental in SQL and can help you retrieve, filter, sort, group, and limit your data effectively.