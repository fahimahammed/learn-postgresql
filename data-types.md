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
```sql
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
```sql
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
```sql
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

## Binary Types

PostgreSQL provides two binary data types for storing binary data: `bytea` and `oid`. Here's a comparison of these types:

| Data Type  | Description                                                | Example                                      |
|------------|------------------------------------------------------------|----------------------------------------------|
| `bytea`    | Used to store binary strings                               | `E'\\x0123456789ABCDEF'`                      |
| `oid`      | Used to store object identifiers and references to large objects | `12345`                                 |

**`bytea`:**

The `bytea` data type in PostgreSQL is used to store binary strings.

- Description: It can store any binary data, such as images, documents, or serialized objects.
- Example: `E'\\x0123456789ABCDEF'` represents a binary string.

**`oid`:**

The `oid` data type in PostgreSQL is used to store object identifiers and references to large objects.

- Description: It is often used to reference large objects stored in the database, such as binary files.
- Example: `12345` represents an object identifier.

When using the `bytea` data type, binary data is typically represented as a hexadecimal string preceded by `\\x`, while `oid` stores numeric object identifiers.

Please note that the usage of the `oid` data type is less common in modern PostgreSQL applications due to the availability of more flexible alternatives, such as the `bytea` data type combined with a separate table for large object management.

For more information, refer to the [PostgreSQL Binary Types Documentation](https://www.postgresql.org/docs/current/datatype-binary.html).

Example:
```sql
-- Create a table to store binary data
CREATE TABLE binary_data (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(100),
    file_data_bytea BYTEA,
    file_data_oid OID
);

-- Insert binary data into the table
INSERT INTO binary_data (file_name, file_data_bytea, file_data_oid)
VALUES
    ('image.jpg', E'\\x89504E470D0A1A0A0000000D49484452...', lo_import('/path/to/document.pdf'));

-- Retrieve binary data from the table
SELECT * FROM binary_data;
```

## Date/Time Types

PostgreSQL provides several data types for working with date and time values. Here's a list of commonly used date/time types in PostgreSQL along with a brief description:

| Data Type                   | Description                                                |
|-----------------------------|------------------------------------------------------------|
| `timestamp`                 | Represents both date and time, without time zone           |
| `date`                      | Represents a date (year, month, day)                       |
| `time`                      | Represents a time of day                                   |
| `interval`                  | Represents a duration or time span                          |
| `timestamp with time zone`  | Represents date and time, including time zone information  |
| `time with time zone`       | Represents time of day, including time zone information    |

When working with date/time values, it's important to consider whether you need to include time zone information or not.

For more information and usage details, refer to the [PostgreSQL Date/Time Types Documentation](https://www.postgresql.org/docs/current/datatype-datetime.html).

Example:
```sql
-- Create a table to store date/time values
CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(100),
    event_date DATE,
    event_time TIME,
    event_timestamp TIMESTAMP,
    event_interval INTERVAL,
    event_timestamp_tz TIMESTAMPTZ,
    event_time_tz TIMETZ
);

-- Insert a record with date/time values into the table
INSERT INTO event (event_name, event_date, event_time, event_timestamp, event_interval, event_timestamp_tz, event_time_tz)
VALUES
    ('Meeting', '2023-07-01', '10:30:00', '2023-07-01 10:30:00', '1 day 3 hours', '2023-07-01 10:30:00+00:00', '10:30:00+00:00');

-- Retrieve the date/time values from the table
SELECT * FROM event;
```

## Boolean Type

PostgreSQL provides a boolean data type for representing true/false values. Here's a brief description of the boolean type:

| Value   | Description                             |
|---------|-----------------------------------------|
| `true`  | Represents a true value                  |
| `false` | Represents a false value                 |
| `null`  | Represents an unknown or missing value   |

The boolean type is used to store logical values, where `true` represents a positive condition or assertion, `false` represents a negative condition or rejection, and `null` represents an unknown or missing value.

In PostgreSQL, the boolean type can be useful for expressing conditions, making logical comparisons, and filtering data based on true/false values.

For more information and usage details, refer to the [PostgreSQL Boolean Type Documentation](https://www.postgresql.org/docs/current/datatype-boolean.html).

```sql
-- Create a table to store employee information
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    is_active BOOLEAN
);

-- Insert employee data into the table
INSERT INTO employees (name, is_active)
VALUES
    ('John Doe', true),
    ('Jane Smith', false),
    ('Michael Johnson', null);

-- Retrieve employee data from the table
SELECT * FROM employees;
```

## Enumerated Type

PostgreSQL allows you to define custom enumerated types, also known as enums. An enumerated type represents a set of predefined values that a column can take. Here's an overview of enumerated types in PostgreSQL:

- An enumerated type is created using the `CREATE TYPE` statement.
- The `ENUM` keyword is used to define the enumerated type.
- You can specify the allowed values for the enumerated type within parentheses.
- Columns of the enumerated type can only store one of the predefined values.

Enumerated types provide a convenient way to enforce data integrity by limiting the values that a column can accept. They can be particularly useful when you have a fixed set of values that a column should take.

Here's an example of creating and using an enumerated type:

```sql
-- Create an enumerated type for gender
CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');

-- Create a table to store user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    gender gender_enum
);

-- Insert user data into the table
INSERT INTO users (name, gender)
VALUES
    ('John Doe', 'Male'),
    ('Jane Smith', 'Female');

-- Retrieve user data from the table
SELECT * FROM users;
```

## Geometric Types

PostgreSQL provides several geometric data types that allow you to store and manipulate geometric objects. Here's a list of commonly used geometric types in PostgreSQL along with a brief description:

| Data Type   | Description                                           |
|-------------|-------------------------------------------------------|
| `point`     | Represents a point in a two-dimensional plane          |
| `lseg`      | Represents a line segment                             |
| `box`       | Represents a rectangular box                           |
| `path`      | Represents a path, consisting of multiple connected line segments |
| `polygon`   | Represents a closed polygon                            |
| `circle`    | Represents a circle                                   |

These geometric types can be useful for various spatial applications such as GIS (Geographic Information Systems) and location-based services. They allow you to store and query geometric data, perform geometric calculations, and perform spatial operations.

For more information and usage details, refer to the [PostgreSQL Geometric Types Documentation](https://www.postgresql.org/docs/current/datatype-geometric.html).

```sql
-- Create a table to store geometric data
CREATE TABLE shapes (
    id SERIAL PRIMARY KEY,
    shape_name VARCHAR(100),
    shape_point POINT,
    shape_lseg LSEG,
    shape_box BOX,
    shape_path PATH,
    shape_polygon POLYGON,
    shape_circle CIRCLE
);

-- Insert geometric data into the table
INSERT INTO shapes (shape_name, shape_point, shape_lseg, shape_box, shape_path, shape_polygon, shape_circle)
VALUES
    ('Point', '(3.5, 4.2)', '[(1, 1), (5, 5)]', '((2, 2), (4, 4))', '((1, 1), (2, 2), (3, 3))', '((0, 0), (0, 5), (5, 5), (5, 0), (0, 0))', '<(2, 2), 3>');

-- Retrieve geometric data from the table
SELECT * FROM shapes;
```

## Network Address Types

PostgreSQL provides two data types for representing network addresses: `INET` and `CIDR`. Here's a brief description of each type:

| Data Type | Description                                     |
|-----------|-------------------------------------------------|
| `INET`    | Stores an IPv4 or IPv6 network address           |
| `CIDR`    | Represents an IP network in CIDR notation        |

The `INET` type allows you to store individual IP addresses, both IPv4 and IPv6. It can store addresses in the format 'X.X.X.X' for IPv4 and 'X:X:X:X:X:X:X:X' for IPv6.

The `CIDR` type represents an IP network in CIDR (Classless Inter-Domain Routing) notation. It stores both the network address and the network mask length, expressed as the number of significant bits in the network mask.

These network address types are useful for applications that deal with networking, IP address management, and IP-based access controls. They provide efficient storage and support various operations and functions for working with network addresses.

For more information and usage details, refer to the [PostgreSQL Network Address Types Documentation](https://www.postgresql.org/docs/current/datatype-net-types.html).

```sql
-- Create a table to store network information
CREATE TABLE networks (
    id SERIAL PRIMARY KEY,
    network_name VARCHAR(100),
    network_address INET,
    network_cidr CIDR
);

-- Insert network data into the table
INSERT INTO networks (network_name, network_address, network_cidr)
VALUES
    ('Local Network', '192.168.0.0/24', '10.0.0.0/16');

-- Retrieve network data from the table
SELECT * FROM networks;
```


## Bit String Types

PostgreSQL provides two data types for representing bit strings: `bit` and `bit varying`. Here's a brief description of each type:

| Data Type       | Description                                      |
|-----------------|--------------------------------------------------|
| `bit(n)`        | Stores fixed-length bit strings of length `n`     |
| `bit varying(n)`| Stores variable-length bit strings of length up to `n` |

The `bit` type is used to store fixed-length bit strings, where `n` represents the number of bits in the string. The `bit varying` type is used for variable-length bit strings, allowing strings of different lengths up to `n` bits.

Bit strings are represented as sequences of `0` and `1` characters. When inserting or querying bit strings, you can use either binary notation (`B'010101'`) or hexadecimal notation (`X'FF'`).

Bit string types are useful for applications that require compact storage and manipulation of binary data at the bit level, such as encoding schemes, flags, or custom data formats.

For more information and usage details, refer to the [PostgreSQL Bit String Types Documentation](https://www.postgresql.org/docs/current/datatype-bit.html).


```sql
-- Create a table to store bit string data
CREATE TABLE flags (
    id SERIAL PRIMARY KEY,
    flag_name VARCHAR(100),
    fixed_flag bit(5),
    varying_flag bit varying(8)
);

-- Insert bit string data into the table
INSERT INTO flags (flag_name, fixed_flag, varying_flag)
VALUES
    ('Flag 1', B'10101', B'11001100'),
    ('Flag 2', B'01100', B'10101010');

-- Retrieve bit string data from the table
SELECT * FROM flags;
```