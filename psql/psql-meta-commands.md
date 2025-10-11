# psql Meta-Commands — Comprehensive Guide

## What are psql meta-commands?

Meta-commands are special commands in the PostgreSQL `psql` shell that begin with a backslash (`\`). They are **not SQL statements** but provide shortcuts for tasks that would otherwise require complex queries or manual steps.

### Key purposes:

- View and explore database objects (tables, columns, indexes, functions)
- Manage database connections and roles
- Import/export data
- Format query results for readability
- Run external shell commands or SQL files

They exist to **simplify common tasks** and make working with PostgreSQL more efficient.

---

## Why are psql meta-commands needed?

- **Time-saving:** No need to write complex SQL to list tables, columns, or users.
- **Convenience:** Quickly connect to databases, run scripts, or inspect schema.
- **Readability:** Easily format and paginate results for wide or large datasets.
- **Integration:** Run shell commands and scripts without leaving the psql shell.

---

## Running meta-commands

1. Open a terminal (not SQL) and run:

```bash
psql -U <username> -d <database>
```

2. You will see a prompt like:

```
yourdb=#:
```

3. All meta-commands are executed from this `psql` prompt.

> **Important:** Meta-commands do **not work in MySQL or other SQL terminals**.

---

## Complete list of commonly used meta-commands

### Database & connection commands

- `\l` — List all databases
- `\c <dbname>` — Connect to a database
- `\conninfo` — Show connection details

### Schema & object commands

- `\dt` — List tables
- `\dv` — List views
- `\di` — List indexes
- `\df` — List functions
- `\d <table>` — Show table structure
- `\d+ <table>` — Verbose table description (includes storage info)
- `\ds` — List sequences
- `\dn` — List schemas

### Roles & user management

- `\du` — List roles and users
- `\dg` — List role memberships

### Running SQL scripts / shell commands

- `\i /path/to/file.sql` — Execute SQL commands from a file
- `\! <shell-command>` — Execute a shell command from within psql

### Data import / export

- `\copy <table> FROM 'file.csv' CSV HEADER` — Import CSV from client
- `\copy <table> TO 'file.csv' CSV HEADER` — Export table to CSV

### Formatting & output control

- `\x` — Toggle expanded output (columns displayed vertically)
- `\a` — Toggle aligned/unaligned output
- `\H` — Output query as HTML table
- `\pset pager on|off` — Enable or disable pager for long outputs
- `\pset format <format>` — Set output format (`aligned`, `unaligned`, `csv`, `html`, etc.)
- `\t` — Toggle row count footer
- `\o filename` — Send output to a file

### Variables & scripting

- `\set name 'value'` — Set a variable in psql
- Use variables in SQL as `:name` or `:'name'`
- `:\g` — Send the current query buffer to the server

### Help commands

- `\?` — List all psql meta-commands
- `\h` — Show SQL syntax help (`\h SELECT` for SELECT)

---

## Using SQL commands directly in psql

Meta-commands are shortcuts, but anything they do can also be done using standard SQL queries. For example:

| Task               | Meta-command   | SQL alternative                                                                                            |
| ------------------ | -------------- | ---------------------------------------------------------------------------------------------------------- |
| List tables        | `\dt`          | `SELECT table_name FROM information_schema.tables WHERE table_schema='public';`                            |
| Show table columns | `\d employees` | `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='employees';` |
| List roles         | `\du`          | `SELECT rolname, rolsuper, rolcreaterole, rolcreatedb FROM pg_roles;`                                      |

✅ **Takeaway:** Meta-commands are faster and easier, but SQL gives full control and flexibility. You can mix both depending on your task.

---

## Example session

```
psql -U postgres -d mydb
\l                  -- list databases
\c mydb             -- switch to mydb
\dt                 -- list tables
\d employees        -- table structure
\x                  -- toggle expanded output
SELECT * FROM employees WHERE id = 1;
\x                  -- toggle expanded off
\i scripts/setup.sql  -- run SQL script
\copy employees FROM 'data/employees.csv' CSV HEADER -- import CSV
\! ls -la           -- run shell command
\q                  -- quit psql
```

---

## Example Questions with Solutions

### Question 1: Show all tables and columns in the `sales` database

**Task:** You want to quickly inspect all tables and their columns in `sales`.

**Solution:**

```sql
\c sales           -- connect to sales database
\dt                 -- list all tables
\d orders           -- show structure of orders table
\d customers        -- show structure of customers table
```

### Question 2: Check all user roles and their privileges

**Task:** List all roles, see which users have superuser privileges, and check memberships.

**Solution:**

```sql
\du                 -- list all roles and their attributes
\dg                 -- show role memberships
```

- Look for `Superuser` column to identify admin users.
- Memberships indicate which roles/users belong to groups.

---

## Notes

- `\copy` vs `COPY`: `\copy` runs on the client machine, `COPY` runs on the server.
- These commands are PostgreSQL-specific; equivalent MySQL commands differ (e.g., `SHOW TABLES;`, `DESCRIBE table;`, `SOURCE file.sql;`).
- Expanded output (`\x`) and formatting commands make reading wide or complex tables easier.
- Both meta-commands and SQL queries can be used in psql. Meta-commands are shortcuts, while SQL provides full control for querying, filtering, and manipulating data.

---

## Summary

psql meta-commands are **essential tools** for efficient database interaction. They simplify inspection, formatting, data import/export, role management, scripting, and executing shell commands, all within the interactive PostgreSQL shell.
