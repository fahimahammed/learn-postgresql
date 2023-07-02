# Advanced Concepts in PostgreSQL
This section covers various advanced concepts in PostgreSQL, including the DISTINCT keyword, constraints, joins, unions, NULL values, aliases, triggers, indexes, altering tables, truncating tables, views, transactions, locks, subqueries, auto-increment, privileges, date/time functions, and useful functions.

## Table of Contents
- [DISTINCT Keyword](#distinct-keyword)
- [Constraints](#constraints)
- [Joins](#joins)
- [UNION Clause](#union-clause)
- [NULL Values](#null-values)
- [Alias syntax](#alias-syntax)
- [Triggers](#triggers)


## DISTINCT Keyword
The DISTINCT keyword in PostgreSQL is used to retrieve unique values from a specified column or a combination of columns in a table. It eliminates duplicate rows and returns only distinct values.

Syntax:
```sql
SELECT DISTINCT column1, column2, ...
FROM table_name;
```

Example: Retrieve distinct values from the "category" column in the "products" table:
```sql
SELECT DISTINCT category
FROM products;
```

This query will return a list of unique categories present in the "products" table, eliminating any duplicate values.

The DISTINCT keyword is handy when you want to identify unique values within a column or perform analysis on distinct data sets.


## Constraints

Constraints in PostgreSQL are used to define rules that restrict the values allowed in columns of a table. Constraints can be applied to a single column, a combination of columns, or an entire table. There are several types of constraints available in PostgreSQL, including:

| Constraint       | Description                                                      |
|------------------|------------------------------------------------------------------|
| PRIMARY KEY      | Ensures the uniqueness and non-nullability of a column or a set of columns.|
| FOREIGN KEY      | Establishes a link between two tables and enforces referential integrity.|
| UNIQUE           | Enforces the uniqueness of values in one or more columns.         |
| CHECK            | Specifies a condition that must be met for a row to be valid.     |
| NOT NULL         | Specifies that a column must not contain any null values.         |
| DEFAULT          | Sets a default value for a column when no value is specified.     |
| EXCLUSION        | Defines an exclusion constraint for a range of values.            |

```sql
-- Example of creating a table with constraints
CREATE TABLE example_table (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    age INT CHECK (age >= 18),
    foreign_key_id INT REFERENCES other_table(id),
    timestamp TIMESTAMP DEFAULT NOW()
);
```

Constraints can be defined when a table is created or added later using the ALTER TABLE statement. Constraints can also be dropped using tthe ALTER TABLE statement.

## Joins

Joins in PostgreSQL are used to combine rows from multiple tables based on a related column between them. Joins allow you to retrieve data from multiple tables simultaneously by specifying a join condition that determines how the tables are connected.

There are different types of joins in PostgreSQL:

| Join Type        | Description                                                      |
|------------------|------------------------------------------------------------------|
| INNER JOIN       | Returns matching rows from both tables based on a specified join condition. It selects only the rows with matching values in both tables.|
| LEFT JOIN        | Returns all rows from the left (or first) table and the matching rows from the right (or second) table. If there are no matches, NULL values are returned for the right table's columns.|
| RIGHT JOIN       | Returns all rows from the right (or second) table and the matching rows from the left (or first) table. If there are no matches, NULL values are returned for the left table's columns.|
| FULL OUTER JOIN  | Returns all rows from both tables, including the unmatched rows. If there are no matches, NULL values are returned for the respective columns of the other table.|

```sql
-- Example of using joins in a query
-- INNER JOIN
SELECT *
FROM table1
INNER JOIN table2 ON table1.column = table2.column;

-- LEFT JOIN
SELECT *
FROM table1
LEFT JOIN table2 ON table1.column = table2.column;

-- RIGHT JOIN
SELECT *
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;

-- FULL OUTER JOIN
SELECT *
FROM table1
FULL OUTER JOIN table2 ON table1.column = table2.column;
```

To perform a join in psql, you specify the join type (INNER JOIN, LEFT JOIN, RIGHT JOIN, or FULL OUTER JOIN) and the join condition using the **ON** clause, which specifies the columns to compare between the tables.

***Note: Joins are a powerful tool for querying data from multiple tables, but they should be used carefully to ensure the desired results and optimize performance.***

## UNION Clause

The UNION clause is used to combine the result sets of two or more SELECT queries into a single result set. It stacks the rows from each query on top of each other, effectively merging the results. 

```sql
-- Example of using the UNION clause
SELECT column1, column2, ...
FROM table1
UNION
SELECT column1, column2, ...
FROM table2;
```
The SELECT queries used with the UNION clause must have the same number of columns and compatible data types. The result set of the UNION operation eliminates duplicate rows from the combined result.

## NULL Values

In PostgreSQL, NULL is a special marker used to indicate the absence of a value or unknown data. NULL is not the same as zero or an empty string. It represents the absence of any value or an unknown value for a particular column in a table.

NULL values can be used in various scenarios, such as when a certain attribute or field is not applicable or when the value is not yet known or available.

When working with NULL values, it's important to consider their behavior in queries and expressions. Some key points to keep in mind are:

- Arithmetic operations involving NULL usually result in a NULL value.
- Comparison operations involving NULL generally evaluate to NULL, except for the IS NULL and IS NOT NULL operators.
- Aggregate functions, such as COUNT, SUM, AVG, etc., automatically exclude NULL values from calculations.
- Use the IS NULL and IS NOT NULL operators to check for NULL values in conditions.

```sql
-- Example of handling NULL values in a query
SELECT column1, column2, ...
FROM table_name
WHERE column3 IS NULL;

SELECT column1, column2, ...
FROM table_name
WHERE column3 IS NOT NULL;
```

The above queries demonstrate how to filter rows based on NULL values using the IS NULL and IS NOT NULL operators.

## ALIAS Syntax

This repository provides a reference for using the ALIAS syntax in PostgreSQL's psql command-line tool.

### Table Alias
To assign an alias to a table, you can use the AS keyword followed by the desired alias name. The table alias can be used in the query to refer to the table.

```sql
-- Example of using table alias
SELECT alias.column1, alias.column2, ...
FROM table_name AS alias;
```

The above query assigns the alias alias to table_name. The alias is then used to refer to the table columns in the SELECT statement.

### Column Alias
To assign an alias to a column, you can use the AS keyword followed by the desired alias name. The column alias can be used in the query to refer to the column and can also be used for display purposes in the result set.

```sql
-- Example of using column alias
SELECT column1 AS alias1, column2 AS alias2, ...
FROM table_name;
```

*The above query assigns the aliases alias1 and alias2 to column1 and column2, respectively. The aliases can be used to refer to the respective columns in the SELECT statement.*

## Triggers

A trigger is a database object that is associated with a table and is automatically executed in response to specific events, such as INSERT, UPDATE, DELETE, or TRUNCATE operations on the table. Triggers enable you to perform custom actions, such as validating data, logging changes, or enforcing business rules, before or after the triggering events.

### Creating Triggers

To create a trigger in PostgreSQL, you need to define the trigger function that encapsulates the desired logic and specify the trigger event, timing (BEFORE or AFTER), and the table associated with the trigger. Here's an syntax of creating a trigger:

```sql
-- Syntax of creating a trigger
CREATE OR REPLACE FUNCTION trigger_function_name()
RETURNS TRIGGER AS $$
BEGIN
    -- Trigger logic here
    -- You can access the OLD and NEW record values for the row that triggered the event
    -- using the OLD and NEW aliases respectively.

    RETURN NEW; -- Use RETURN NEW; to allow the triggering operation to proceed
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_name
BEFORE INSERT OR UPDATE OR DELETE -- Specify the trigger events
ON table_name -- Specify the table on which the trigger is associated
FOR EACH ROW -- Use FOR EACH ROW to specify that the trigger function is invoked for each affected row
EXECUTE FUNCTION trigger_function_name();
```

In the above syntax, the trigger function trigger_function_name is created using the PL/pgSQL language. The trigger is associated with the table table_name and is set to be executed BEFORE INSERT, UPDATE, or DELETE operations on each affected row.


Example:
```sql
-- Example of creating a trigger
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_table (event_type, event_time, table_name, new_data)
        VALUES ('INSERT', NOW(), TG_TABLE_NAME, NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_table (event_type, event_time, table_name, old_data, new_data)
        VALUES ('UPDATE', NOW(), TG_TABLE_NAME, OLD, NEW);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_table (event_type, event_time, table_name, old_data)
        VALUES ('DELETE', NOW(), TG_TABLE_NAME, OLD);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_trigger
AFTER INSERT OR UPDATE OR DELETE
ON target_table
FOR EACH ROW
EXECUTE FUNCTION log_changes();
```

In the above example, a trigger function named `log_changes` is created. This function is responsible for logging the changes made to a table into an `audit_table`. The trigger is associated with the `target_table` and is set to execute after each INSERT, UPDATE, or DELETE operation on each affected row.

The `log_changes` function uses conditional statements (IF-ELSEIF-ELSE) to determine the operation that triggered the trigger (TG_OP). Based on the operation type, it inserts the appropriate data into the audit_table.

Note that you need to replace `audit_table`, `target_table`, and adjust the column names and data types in the INSERT INTO statements according to your specific table structure.