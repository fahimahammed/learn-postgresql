PostgreSQL Beginner Guide

This document provides a practical introduction to PostgreSQL for beginners. It explains how to install PostgreSQL, use the command-line interface, and perform fundamental database operations.

1. Introduction

PostgreSQL is an open-source relational database management system known for its reliability, flexibility, and performance. It supports both SQL (relational) and JSON (non-relational) querying, making it suitable for a wide range of applications.

This guide is intended to help new learners understand PostgreSQL fundamentals before moving on to advanced topics.

2. Installation
macOS

Install PostgreSQL using Homebrew:

brew install postgresql
brew services start postgresql

Windows

Go to the official PostgreSQL download page:
https://www.postgresql.org/download/

Choose Windows, then follow the installation wizard.

After installation, open SQL Shell (psql) to start working with PostgreSQL.

Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql


Verify installation:

psql --version

3. Connecting to PostgreSQL

Use the following command to connect to PostgreSQL as the default user:

psql -U postgres


To list all databases:

\l


To connect to a specific database:

\c database_name


To exit the terminal:

\q

4. Basic SQL Commands
Command	Description
CREATE DATABASE name;	Create a new database
DROP DATABASE name;	Delete an existing database
CREATE TABLE table_name (...);	Create a new table
\dt	List all tables
INSERT INTO table_name (...) VALUES (...);	Insert data into a table
SELECT * FROM table_name;	Retrieve all records
UPDATE table_name SET ... WHERE ...;	Update existing records
DELETE FROM table_name WHERE ...;	Delete records
5. Example: Creating a Database and Table
Create a Database
CREATE DATABASE bookstore;


Connect to it:

\c bookstore

Create a Table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(50),
    published_year INT
);

Insert Sample Data
INSERT INTO books (title, author, published_year)
VALUES ('The Alchemist', 'Paulo Coelho', 1988),
       ('To Kill a Mockingbird', 'Harper Lee', 1960);

View Data
SELECT * FROM books;

6. Update and Delete Operations

Update a record:

UPDATE books
SET published_year = 1993
WHERE id = 1;


Delete a record:

DELETE FROM books
WHERE id = 2;

7. Filtering and Sorting

Filter results:

SELECT * FROM books WHERE author = 'Paulo Coelho';


Sort results:

SELECT * FROM books ORDER BY published_year DESC;

8. Exporting and Importing Data

Export a database:

pg_dump bookstore > bookstore_backup.sql


Import a database:

psql -U postgres -d bookstore -f bookstore_backup.sql

9. Useful Clauses and Examples
WHERE Clause
SELECT * FROM books WHERE published_year > 1980;

GROUP BY and Aggregate Functions
SELECT author, COUNT(*) AS total_books
FROM books
GROUP BY author;

LIMIT Clause
SELECT * FROM books LIMIT 3;

10. Best Practices

Use descriptive names for databases, tables, and columns.

Back up your databases regularly using pg_dump.

Use transactions for complex operations (BEGIN, COMMIT, ROLLBACK).

Avoid using the default postgres user in production.

Review user privileges using \du and manage them carefully.

11. Learning Resources

Official Documentation: https://www.postgresql.org/docs/

PostgreSQL Tutorial: https://www.postgresqltutorial.com/

SQL Practice: https://sqlbolt.com/

12. Conclusion

This guide covers basic PostgreSQL setup and commands for learners starting from scratch.
It can be extended with additional examples or use cases as you continue learning.

Contributions and improvements to this guide are welcome.
