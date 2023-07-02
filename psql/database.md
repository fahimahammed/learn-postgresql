# PostgreSQL Database Operations

PostgreSQL is a powerful open-source relational database management system that offers a wide range of features for managing data. This guide provides an overview of the common database operations in PostgreSQL.

## Table of Contents

- [Create Database](#create-database)
- [Select Database](#select-database)
- [Drop Database](#drop-database)

## Create Database

To create a database in PostgreSQL, you can use the `CREATE DATABASE` command followed by the name of the database you want to create. Here's the syntax:

```sql
CREATE DATABASE database_name;
```

Example:
```sql
CREATE DATABASE mydatabase;
```

## Select Database
To select a database for performing operations, you need to establish a connection to that database. In PostgreSQL, you can use the CONNECT command or the SET command to set the current database. Here are the examples:

Using `CONNECT`:
```sql
\c database_name;
```

Example:
```sql
\c mydatabase;
```

Alternatively, you can also use the SET command to set the current database. Here's the syntax:
```sql
SET DATABASE = database_name;
```

## Drop Database

To drop or delete a database, you can use the DROP DATABASE command followed by the name of the database. However, be cautious as dropping a database will permanently delete all data and cannot be undone. Here's the syntax:

```sql
DROP DATABASE database_name;
```
Example:
```sql
DROP DATABASE mydatabase;
```

Please note that creating, selecting, or dropping a database might require appropriate privileges and permissions based on the user executing the commands.

It's essential to exercise caution while performing database operations, especially when dropping a database, as it permanently removes all data associated with it.