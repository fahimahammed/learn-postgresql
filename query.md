# Querying Data in PostgreSQL

PostgreSQL provides a rich set of SQL queries for manipulating and retrieving data from the database. This guide covers the commonly used queries: INSERT, SELECT, UPDATE, and DELETE.

## Table of Content
- [INSERT Query](#insert-query)
- [SELECT Query](#select-query)
- [UPDATE Query](#update-query)
- [DELETE Query](#delete-query)


## INSERT Query

The INSERT query is used to insert new rows of data into a table. Here's the basic syntax:

```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```
For example, to insert a new record into a table named "employees" with columns "id" and "name", you can use the following query:
```sql
INSERT INTO employees (id, name)
VALUES (1, 'John Doe');
```

## SELECT Query
The SELECT query is used to retrieve data from one or more tables in the database. Here's an example:

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```
For instance, to select all records from the "employees" table, you can use the following query:
```sql
SELECT * FROM employees;
```

## UPDATE Query
The UPDATE query is used to modify existing data in a table. Here's the basic syntax:
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

For example, to update the name of an employee with ID 1 in the "employees" table, you can use the following query:
```sql
UPDATE employees
SET name = 'Jane Smith'
WHERE id = 1;
```

## DELETE Query
The DELETE query is used to delete one or more rows from a table. Here's an example:
```sql
DELETE FROM table_name
WHERE condition;
```

For instance, to delete all records from the "employees" table where the age is greater than 60, you can use the following query:
```sql
DELETE FROM employees
WHERE age > 60;
```

With the INSERT, SELECT, UPDATE, and DELETE queries, you can perform a wide range of data manipulation and retrieval tasks in PostgreSQL. Experiment with these queries to interact with your database and manage your data effectively.