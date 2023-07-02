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

## Text Search Types

PostgreSQL provides two data types for text search: `tsvector` and `tsquery`. Here's a brief description of each type:

| Data Type  | Description                                             |
|------------|---------------------------------------------------------|
| `tsvector` | Stores a document or text search index                   |
| `tsquery`  | Represents a search query or search condition            |

The `tsvector` type is used to store a document or text search index. It represents a parsed and transformed version of the document, with individual words and their positions.

The `tsquery` type is used to represent a search query or search condition. It allows you to specify search terms, Boolean operators, and other search operators for performing complex text searches.

The text search types enable powerful full-text search capabilities in PostgreSQL. They support features such as stemming, ranking, phrase searching, and more. You can perform efficient text search queries and match documents based on relevance to the search query.

For more information and usage details, refer to the [PostgreSQL Full Text Search Documentation](https://www.postgresql.org/docs/current/textsearch.html).

Example:
```sql
-- Create a table to store documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    document_title VARCHAR(100),
    document_content TEXT,
    document_search_index TSVECTOR
);

-- Create a text search index on the document_content column
CREATE INDEX idx_document_search ON documents USING gin(document_search_index);

-- Insert documents into the table
INSERT INTO documents (document_title, document_content, document_search_index)
VALUES
    ('Document 1', 'This is the content of document 1', to_tsvector('english', 'This is the content of document 1')),
    ('Document 2', 'This is the content of document 2', to_tsvector('english', 'This is the content of document 2'));

-- Perform a text search query
SELECT * FROM documents WHERE document_search_index @@ to_tsquery('english', 'content');

-- Update the text search index for new documents
UPDATE documents SET document_search_index = to_tsvector('english', document_content) WHERE id > 2;
```

## UUID Type 

PostgreSQL provides a data type called `uuid` for storing universally unique identifiers (UUIDs). Here's a brief description of the type:

| Data Type | Description                               |
|-----------|-------------------------------------------|
| `uuid`    | Stores a 128-bit universally unique identifier |

A UUID is a 128-bit value that is unique across all space and time. It is typically represented as a sequence of 32 hexadecimal digits separated by hyphens. For example, `550e8400-e29b-41d4-a716-446655440000`.

The `uuid` type in PostgreSQL allows you to store and manipulate UUID values. It provides efficient storage and indexing, making it suitable for primary keys, unique identifiers, or when you need to ensure global uniqueness of an entity.

To generate UUID values, you can use functions such as `uuid_generate_v4()` or libraries in your programming language of choice.

For more information and usage details, refer to the [PostgreSQL UUID Type Documentation](https://www.postgresql.org/docs/current/datatype-uuid.html).


```sql
-- Create a table to store data with UUID
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100),
    email VARCHAR(100)
);

-- Insert data with UUID into the table
INSERT INTO users (username, email)
VALUES
    ('fahim', 'fahim@example.com'),
    ('firoz', 'firoz@example.com');

-- Retrieve data from the table
SELECT * FROM users;
```

## XML Type

PostgreSQL provides a data type called `xml` for storing XML (eXtensible Markup Language) data. Here's a brief description of the type:

| Data Type | Description                              |
|-----------|------------------------------------------|
| `xml`     | Stores XML documents or fragments of XML |

The `xml` data type in PostgreSQL allows you to store XML documents or fragments of XML. XML is a popular standard for representing structured data, and it is widely used in various applications and industries.

The `xml` data type supports storing well-formed XML documents, which can be queried, searched, and manipulated using various XML functions and operators provided by PostgreSQL.

You can insert XML data into a table, retrieve XML data, perform XML-specific queries, and extract information from XML documents using XPath expressions or XML-specific functions.

For more information and usage details, refer to the [PostgreSQL XML Type Documentation](https://www.postgresql.org/docs/current/datatype-xml.html).

Example:
```sql
-- Create a table to store XML data
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(100),
    content XML
);

-- Insert XML data into the table
INSERT INTO books (title, author, content)
VALUES
    ('Book 1', 'Author 1', '<book><chapter>Chapter 1</chapter><chapter>Chapter 2</chapter></book>'),
    ('Book 2', 'Author 2', '<book><chapter>Chapter 3</chapter><chapter>Chapter 4</chapter></book>');

-- Retrieve XML data from the table
SELECT * FROM books;

-- Extract information from XML using XPath
SELECT xpath('/book/chapter', content) AS chapters FROM books WHERE id = 1;
```

## JSON Type

PostgreSQL provides a data type called `json` for storing JSON (JavaScript Object Notation) data. Here's a brief description of the type:

| Data Type | Description                       |
|-----------|-----------------------------------|
| `json`    | Stores JSON data                  |

The `json` data type in PostgreSQL allows you to store JSON documents or JSON-formatted data. JSON is a widely used data interchange format that is human-readable and easy to parse.

With the `json` data type, you can store JSON objects, arrays, or scalar values within a single column of a table. PostgreSQL provides various functions and operators for working with JSON data, allowing you to query, extract, modify, and aggregate JSON values.

You can insert JSON data into a table, retrieve JSON data, perform JSON-specific queries using the JSON operators, and navigate the JSON structure using the JSON functions provided by PostgreSQL.

For more information and usage details, refer to the [PostgreSQL JSON Type Documentation](https://www.postgresql.org/docs/current/datatype-json.html).

Example:
```sql
-- Create a table to store JSON data
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    contact JSON
);

-- Insert JSON data into the table
INSERT INTO employees (name, contact)
VALUES
    ('John Doe', '{"email": "john.doe@example.com", "phone": "123-456-7890"}'),
    ('Jane Smith', '{"email": "jane.smith@example.com", "phone": "987-654-3210"}');

-- Retrieve JSON data from the table
SELECT * FROM employees;

-- Query JSON data using JSON operators
SELECT * FROM employees WHERE contact ->> 'email' = 'john.doe@example.com';
```

## Array Type

PostgreSQL provides a data type called `array` for storing arrays of values. Here's a brief description of the type:

| Data Type | Description                        |
|-----------|------------------------------------|
| `array`   | Stores arrays of values             |

The `array` data type in PostgreSQL allows you to store multiple values of the same data type within a single column. Arrays can be used to store simple types such as integers, strings, or complex types like JSON objects or custom composite types.

PostgreSQL provides various functions and operators for working with arrays, allowing you to query, manipulate, and aggregate array values. You can perform operations such as array concatenation, element access, array length, and array containment checks.

To define an array column, you specify the base data type followed by `[]`. For example, `integer[]` represents an array of integers.

Arrays can have multiple dimensions, allowing you to create multi-dimensional arrays or arrays of arrays.

For more information and usage details, refer to the [PostgreSQL Array Type Documentation](https://www.postgresql.org/docs/current/arrays.html).


Example:
```sql
-- Create a table to store array data
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    grades INTEGER[]
);

-- Insert array data into the table
INSERT INTO students (name, grades)
VALUES
    ('John Doe', ARRAY[85, 92, 78]),
    ('Jane Smith', ARRAY[90, 88, 95]);

-- Retrieve array data from the table
SELECT * FROM students;

-- Query array data using array operators
SELECT * FROM students WHERE 90 = ANY(grades);
```

## Composite Type

PostgreSQL allows you to define custom composite types, also known as row types. Here's a brief description of the type:

| Data Type         | Description                         |
|-------------------|-------------------------------------|
| Composite Type    | User-defined custom data structure   |

The composite type in PostgreSQL allows you to define a custom data structure composed of multiple fields. It is useful when you want to group related data fields together and manipulate them as a single unit.

To create a composite type, you define its structure by specifying the name and data types of each field. Once defined, you can use the composite type to create tables, define function parameters, or return values from functions.

Composite types can contain fields of any data type, including built-in types, user-defined types, or even other composite types. This flexibility allows you to create complex data structures that match your specific needs.

When working with composite types, you can access individual fields using dot notation (e.g., `composite_field.field_name`) or use the composite type as a whole in queries or assignments.

For more information and usage details, refer to the [PostgreSQL Composite Type Documentation](https://www.postgresql.org/docs/current/rowtypes.html).

```sql
-- Create a composite type
CREATE TYPE person_type AS (
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    age INTEGER
);

-- Create a table using the composite type
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    person person_type,
    department VARCHAR(50)
);

-- Insert data into the table
INSERT INTO employees (person, department)
VALUES
    (ROW('John', 'Doe', 30), 'Engineering'),
    (ROW('Jane', 'Smith', 35), 'Sales');

-- Retrieve data from the table
SELECT id, (person).first_name, (person).last_name, (person).age, department
FROM employees;
```

## Range Type

PostgreSQL provides a data type called `range` for representing and manipulating ranges of values. Here's a brief description of the type:

| Data Type | Description                       |
|-----------|-----------------------------------|
| `range`   | Represents a range of values      |

The `range` data type in PostgreSQL allows you to store and work with ranges of values. It is useful when you need to represent continuous or discrete ranges such as time intervals, numeric ranges, or date ranges.

Ranges can be defined for various built-in data types, including numeric, date, time, timestamp, and custom types. PostgreSQL provides a rich set of functions and operators for working with range values, allowing you to perform operations like range containment checks, overlaps, intersections, and merging.

To define a range column, you specify the base data type followed by the keyword `range`. For example, `int4range` represents a range of integers.

Ranges can be inclusive or exclusive, and they can have lower and upper bounds specified. You can also create unbounded ranges that include all possible values of a particular data type.

For more information and usage details, refer to the [PostgreSQL Range Type Documentation](https://www.postgresql.org/docs/current/rangetypes.html).


Example:
```sql
-- Create a table with a range column
CREATE TABLE temperature_readings (
    id SERIAL PRIMARY KEY,
    reading_range int4range
);

-- Insert range values into the table
INSERT INTO temperature_readings (reading_range)
VALUES
    ('[0, 10)'),        -- Range from 0 (inclusive) to 10 (exclusive)
    ('(20, 30]'),       -- Range from 20 (exclusive) to 30 (inclusive)
    ('[15, 25]');       -- Range from 15 (inclusive) to 25 (inclusive)

-- Retrieve data from the table
SELECT * FROM temperature_readings;

-- Query data using range operators
SELECT * FROM temperature_readings
WHERE reading_range @> 5;  -- Check if range contains the value 5
```

## Object Identifier Type

PostgreSQL provides a data type called `oid` for storing object identifiers. Here's a brief description of the type:

| Data Type | Description                       |
|-----------|-----------------------------------|
| `oid`     | Represents object identifiers     |

The `oid` data type in PostgreSQL is an internal data type used to store unique identifiers for database objects. It is primarily used by the PostgreSQL system itself to manage and reference various system objects, such as tables, indexes, functions, and more.

Object identifiers (`oid`) are automatically assigned by the PostgreSQL system when creating database objects. They provide a way to uniquely identify and reference these objects within the database.

While object identifiers (`oid`) are primarily used by the system, they can also be used in certain cases where you need to interact with or reference system objects directly. However, it's important to note that direct usage of `oid` types in application code is generally discouraged.

For more information and usage details, refer to the [PostgreSQL Object Identifier Type Documentation](https://www.postgresql.org/docs/current/datatype-oid.html).


Example:
```sql
-- Create a table with an oid column
CREATE TABLE image_gallery (
    id SERIAL PRIMARY KEY,
    image_name VARCHAR(100),
    image_oid OID
);

-- Insert data into the table
INSERT INTO image_gallery (image_name, image_oid)
VALUES
    ('image1.jpg', lo_import('/path/to/image1.jpg')),
    ('image2.jpg', lo_import('/path/to/image2.jpg'));

-- Retrieve data from the table
SELECT * FROM image_gallery;

-- Retrieve image by oid
SELECT lo_export(image_oid, '/path/to/exported_image.jpg')
FROM image_gallery
WHERE image_name = 'image1.jpg';
```

## Pseudo Types 

PostgreSQL provides a set of pseudo types that represent specific concepts or behaviors within SQL queries or function definitions. Here's a list of some commonly used pseudo types:

| Pseudo Type   | Description                                          |
|---------------|------------------------------------------------------|
| `void`        | Represents a function that returns no value           |
| `record`      | Represents a row or record with a variable structure  |
| `any`         | Represents any data type                             |
| `anyelement`  | Represents any data type                             |
| `trigger`     | Represents a trigger function's argument structure    |

Pseudo types in PostgreSQL allow for flexibility and generic behavior in various scenarios. Here's a brief description of each pseudo type:

- `void`: Represents a function that doesn't return any value. It is typically used for functions that perform actions but don't need to return a result.
- `record`: Represents a row or record with a variable structure. It can be used to store or manipulate data from multiple tables dynamically.
- `any` and `anyelement`: Represent any data type. They are often used in function or query definitions where the input or return type can be of any data type.
- `trigger`: Represents the argument structure of a trigger function. It allows access to the OLD and NEW row values during trigger execution.

Pseudo types provide flexibility and convenience when working with dynamic data structures, generic functions, or triggers in PostgreSQL.

For more information and usage details on each pseudo type, refer to the [PostgreSQL Pseudo Types Documentation](https://www.postgresql.org/docs/current/datatype-pseudo.html).


Example:
```sql
-- Create a function that returns void
CREATE FUNCTION log_message(message text) RETURNS void AS $$
BEGIN
    -- Log the message to the console
    RAISE NOTICE '%', message;
END;
$$ LANGUAGE plpgsql;

-- Call the function that returns void
SELECT log_message('This is a log message');

-- Create a function that accepts a record as a parameter
CREATE FUNCTION get_employee_details(employee_id INT) RETURNS record AS $$
DECLARE
    employee RECORD;
BEGIN
    -- Retrieve employee details from the employees table
    SELECT * INTO employee FROM employees WHERE id = employee_id;
    RETURN employee;
END;
$$ LANGUAGE plpgsql;

-- Call the function that accepts a record as a parameter
SELECT * FROM get_employee_details(1);

-- Create a function that accepts any data type as a parameter
CREATE FUNCTION print_data(data any) RETURNS void AS $$
BEGIN
    -- Print the input value
    RAISE NOTICE '%', data;
END;
$$ LANGUAGE plpgsql;

-- Call the function that accepts any data type as a parameter
SELECT print_data(123);
SELECT print_data('Hello, World!');

-- Create a trigger function that uses the trigger pseudo type
CREATE FUNCTION log_changes() RETURNS trigger AS $$
BEGIN
    -- Log the old and new values of the updated row
    RAISE NOTICE 'Old values: %', OLD;
    RAISE NOTICE 'New values: %', NEW;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on the employees table
CREATE TRIGGER employee_changes AFTER UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION log_changes();
```