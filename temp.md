# Learn PostgreSQL

### What is PostgreSQL?
PostgreSQL is an open-source relational database management system. It was initially released in 1989 as a research project. PostgreSQL supports a wide range of data types and offers numerous features, including multi-version concurrency control, triggers, foreign keys, and stored procedures. It is renowned for its stability, reliability, and robustness, making it a popular choice for applications that require high performance, scalability, and data integrity.


### Features
PostgreSQL has a wide range of features that make it a powerful and populer relational database management system. 

1. ACID Compliance: PostgreSQL is fully compliant with ACID (Atomicity, Consistency, Isolation, Durability) properties, which ensures the reliability and consistency of data.

2. JSON support: PostgreSQL provides support for storing and querying JSON documents.

3. High Performance: PostgreSQL is designed to handle high workloads and complex queries efficiently.

4. Security: PostgreSQL includes a variety of security features like SSL support, access control, and encrypted connections, which help keep data secure.

5. Open source: PostgreSQL is open source software and is available under the PostgreSQL License, which allows users to modify and distribute the software freely.

6. Replication and Clustering: PostgreSQL supports multiple replication methods and can be easily configured to operate in a clustered environment, which provides high availability and fault tolerance.


## Installation

### Windows

1. Download the PostgreSQL installer for Windows from the official PostgreSQL website: [Download Link](https://www.postgresql.org/download/windows/)

2. Run the downloaded installer.

3. Follow the installation wizard instructions and select the components you want to install. Make note of the port number and password you set during the installation.

### macOS

1. You have multiple options for installing PostgreSQL on macOS:

   - Homebrew: Open Terminal and run the command `brew install postgresql`.
   - Postgres.app: Download and install the Postgres.app from [Postgres.app](https://postgresapp.com/).
   - PostgreSQL official distribution: Download the macOS installer from [Download Link](https://www.postgresql.org/download/macosx/) and run it.

2. Follow the installation instructions provided by the chosen method.

### Linux

1. Update the package list on your system by running the following command:

   - For Ubuntu/Debian:
     ```
     sudo apt update
     ```

   - For CentOS/Fedora:
     ```
     sudo dnf update
     ```

2. Install PostgreSQL using the package manager:

   - For Ubuntu/Debian:
     ```
     sudo apt install postgresql
     ```

   - For CentOS/Fedora:
     ```
     sudo dnf install postgresql
     ```

3. Once the installation is complete, PostgreSQL should be up and running. Refer to the documentation for your specific Linux distribution on how to start or enable the PostgreSQL service.

4. Optionally, you can secure your PostgreSQL installation by setting a password for the database superuser account (`postgres`).

You can refer to the official PostgreSQL documentation for more detailed installation instructions specific to your operating system and distribution.



## Data Types
### Numeric Types
PostgreSQL provides several numeric types that can be used to represent numbers of various sizes and precision. Here are some of the most commonly used numeric types in PostgreSQL:

| Numeric Type       | Description                                                            | Range                                                   |
|------------------- |-----------------------------------------------------------------------|---------------------------------------------------------|
| `integer`          | 32-bit signed integer                                                  | -2,147,483,648 to 2,147,483,647                        |
| `bigint`           | 64-bit signed integer                                                  | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |
| `numeric`/`decimal`| Arbitrary precision numeric value                                      | Up to 131,072 digits before the decimal point, up to 16,383 digits after the decimal point |
| `real`             | 32-bit floating-point (single precision)                               | 6 decimal digits of precision                           |
| `double precision` | 64-bit floating-point (double precision)                               | 15 decimal digits of precision                          |
| `smallint`         | 16-bit signed integer                                                  | -32,768 to 32,767                                      |
| `serial`           | Auto-incrementing 32-bit signed integer                                | 1 to 2,147,483,647                                     |
| `bigserial`        | Auto-incrementing 64-bit signed integer                                | 1 to 9,223,372,036,854,775,807                          |


Example:
```bash
-- Create a table to store numeric data
CREATE TABLE numeric_data (
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    price NUMERIC(10, 2),
    discount REAL
);

-- Insert some sample data into the table
INSERT INTO numeric_data (quantity, price, discount)
VALUES
    (5, 10.99, 0.15),
    (3, 7.50, 0.10),
    (2, 14.75, 0.20);

-- Retrieve the data from the table
SELECT * FROM numeric_data;
```

## Monetary Data Types

In PostgreSQL, there are two primary data types available for storing monetary values: `money` and `numeric`. Here's a comparison of these data types:

| Data Type | Description                               | Storage Size         | Precision            | Range                             |
|-----------|-------------------------------------------|----------------------|----------------------|-----------------------------------|
| `money`   | Represents currency values with precision | 8 bytes              | Platform-dependent   | Up to ±922,337,203,685,477.58     |
| `numeric` | Arbitrary precision numeric type          | Variable              | User-defined         | Variable                          |

**`money`:**

The `money` data type in PostgreSQL is designed specifically for representing monetary values. It provides a fixed-precision storage format for currency amounts.

- Storage Size: 8 bytes
- Precision: The precision of the `money` type is platform-dependent.
- Range: The range of the `money` type is up to ±922,337,203,685,477.58.

**`numeric`:**

The `numeric` data type, also known as `decimal`, is an arbitrary precision numeric type. It allows you to define the precision and scale explicitly, making it suitable for precise calculations involving monetary values.

- Storage Size: Variable
- Precision: User-defined. You can specify the desired precision and scale when creating a `numeric` column.
- Range: The range of the `numeric` type is flexible and can be adjusted based on the specified precision and scale.

When choosing between `money` and `numeric` for storing monetary values, consider the desired precision, range, and the level of control you need for calculations.

For more information, refer to the [PostgreSQL Numeric Types Documentation](https://www.postgresql.org/docs/current/datatype-numeric.html).

Example: 
```bash
-- Create a table to store product prices using money and numeric types
CREATE TABLE product_prices (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100),
    price_money MONEY,
    price_numeric NUMERIC(10, 2)
);

-- Insert sample data into the table
INSERT INTO product_prices (product_name, price_money, price_numeric)
VALUES
    ('Product A', '$9.99', 9.99),
    ('Product B', '$19.99', 19.99),
    ('Product C', '$14.50', 14.50);

-- Retrieve the product prices from the table
SELECT * FROM product_prices;
```

## Character Types

In PostgreSQL, there are several character data types available for storing textual data. Here's a comparison of the commonly used character types: `char(n)`, `varchar(n)`, and `text`:

| Data Type   | Description                                       | Maximum Length    | Storage Size    |
|-------------|---------------------------------------------------|-------------------|-----------------|
| `char(n)`   | Fixed-length character string                     | Up to `n`        | `n` bytes       |
| `varchar(n)`| Variable-length character string                   | Up to `n`        | 1 or 2 bytes + actual length  |
| `text`      | Variable-length character string with unlimited length | Unlimited  | 1 or 2 bytes + actual length  |

**`char(n)`:**

The `char(n)` data type in PostgreSQL allows you to store fixed-length character strings.

- Maximum Length: Up to `n` characters.
- Storage Size: `n` bytes are allocated regardless of the actual content.

**`varchar(n)`:**

The `varchar(n)` data type allows you to store variable-length character strings with a specified maximum length.

- Maximum Length: Up to `n` characters.
- Storage Size: 1 or 2 bytes are used to store the actual length of the string, plus the actual content.

**`text`:**

The `text` data type is used to store variable-length character strings with no specified maximum length.

- Maximum Length: Unlimited.
- Storage Size: 1 or 2 bytes are used to store the actual length of the string, plus the actual content.

When choosing between these character types, consider the desired storage behavior and the maximum length of the strings you intend to store.

For more information, refer to the [PostgreSQL Character Types Documentation](https://www.postgresql.org/docs/current/datatype-character.html).


Example: 
```bash
-- Create a table to store user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username CHAR(10),
    email VARCHAR(50),
    bio TEXT
);

-- Insert sample data into the table
INSERT INTO users (username, email, bio)
VALUES ('fahim', 'fahim@ph.com', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
```

