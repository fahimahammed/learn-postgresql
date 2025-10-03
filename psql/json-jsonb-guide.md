# Mastering PostgreSQL JSON/JSONB Operations

Modern applications frequently work with semi-structured data, and PostgreSQL provides excellent support for storing and querying JSON data. With **JSON** and **JSONB** data types, you can store flexible, nested data structures directly in your database while maintaining powerful query capabilities.

The key difference? **JSONB** (JSON Binary) is the format you'll use 99% of the time. It stores data in a decomposed binary format that's slightly slower to insert but much faster to query and supports indexing.

## Why Use JSON/JSONB in PostgreSQL?

1. **Flexibility**: Store nested, variable-schema data without creating complex table structures.
2. **Performance**: JSONB is optimized for querying and supports indexing.
3. **Native Operators**: Rich set of operators and functions for extracting, filtering, and manipulating JSON data.
4. **Best of Both Worlds**: Combine structured relational data with flexible JSON fields in the same table.

## JSON vs JSONB: Which One?

| Feature | JSON | JSONB |
|---------|------|-------|
| Storage | Exact text copy | Binary, decomposed |
| Insert Speed | Faster | Slightly slower |
| Query Speed | Slower | Much faster |
| Indexing | No | Yes |
| Preserves formatting | Yes | No |
| Preserves key order | Yes | No |
| Duplicate keys | Preserved | Last value wins |

**Recommendation**: Use **JSONB** unless you specifically need to preserve exact formatting or key order.

---

## Core Operators and Functions

Before we dive into examples, here are the essential operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `->` | Get JSON object field as JSON | `data -> 'name'` |
| `->>` | Get JSON object field as text | `data ->> 'name'` |
| `#>` | Get nested object by path (JSON) | `data #> '{address,city}'` |
| `#>>` | Get nested object by path (text) | `data #>> '{address,city}'` |
| `@>` | Does left JSON contain right? | `data @> '{"active":true}'` |
| `<@` | Is left JSON contained in right? | `'{"a":1}' <@ data` |
| `?` | Does key/element exist? | `data ? 'email'` |
| `?|` | Do any keys exist? | `data ?| array['email','phone']` |
| `?&` | Do all keys exist? | `data ?& array['name','email']` |

---

## Let's Build Some Examples

We'll create a `users` table that combines traditional columns with flexible JSONB data.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile JSONB,
    settings JSONB,
    metadata JSONB
);

-- Insert some sample data
INSERT INTO users (username, profile, settings, metadata) VALUES
('alice', 
 '{"name": "Alice Johnson", "age": 28, "email": "alice@example.com", "address": {"city": "New York", "country": "USA"}, "skills": ["Python", "PostgreSQL", "React"]}',
 '{"theme": "dark", "notifications": {"email": true, "push": false}, "language": "en"}',
 '{"last_login": "2024-01-15T10:30:00Z", "login_count": 42, "premium": true}'
),
('bob',
 '{"name": "Bob Smith", "age": 35, "email": "bob@example.com", "address": {"city": "London", "country": "UK"}, "skills": ["Java", "Spring", "Docker"]}',
 '{"theme": "light", "notifications": {"email": true, "push": true}, "language": "en"}',
 '{"last_login": "2024-01-14T15:45:00Z", "login_count": 128, "premium": false}'
),
('charlie',
 '{"name": "Charlie Davis", "age": 24, "email": "charlie@example.com", "address": {"city": "Toronto", "country": "Canada"}, "skills": ["JavaScript", "Node.js", "MongoDB"]}',
 '{"theme": "dark", "notifications": {"email": false, "push": true}, "language": "fr"}',
 '{"last_login": "2024-01-16T08:20:00Z", "login_count": 15, "premium": true}'
);
```

### Example 1: Extracting JSON Values

**Goal**: Get user names and emails from the profile JSON.

```sql
-- Extract as JSON (preserves type)
SELECT
  username,
  profile -> 'name' as name_json,
  profile -> 'email' as email_json
FROM users;
```

**Result:**

| username | name_json        | email_json            |
|----------|------------------|-----------------------|
| alice    | "Alice Johnson"  | "alice@example.com"   |
| bob      | "Bob Smith"      | "bob@example.com"     |
| charlie  | "Charlie Davis"  | "charlie@example.com" |

Notice the quotes? That's because `->` returns JSON. For text values, use `->>`:

```sql
-- Extract as text (removes quotes)
SELECT
  username,
  profile ->> 'name' as name,
  profile ->> 'email' as email
FROM users;
```

**Result:**

| username | name           | email               |
|----------|----------------|---------------------|
| alice    | Alice Johnson  | alice@example.com   |
| bob      | Bob Smith      | bob@example.com     |
| charlie  | Charlie Davis  | charlie@example.com |

### Example 2: Accessing Nested JSON

**Goal**: Get the city from the nested address object.

```sql
-- Method 1: Chain operators
SELECT
  username,
  profile -> 'address' -> 'city' as city_json,
  profile -> 'address' ->> 'city' as city_text
FROM users;

-- Method 2: Use path operator (cleaner for deep nesting)
SELECT
  username,
  profile #> '{address,city}' as city_json,
  profile #>> '{address,city}' as city_text
FROM users;
```

**Result:**

| username | city_json   | city_text |
|----------|-------------|-----------|
| alice    | "New York"  | New York  |
| bob      | "London"    | London    |
| charlie  | "Toronto"   | Toronto   |

### Example 3: Filtering with JSONB Operators

**Goal**: Find all users with dark theme enabled.

```sql
SELECT
  username,
  settings ->> 'theme' as theme
FROM users
WHERE settings ->> 'theme' = 'dark';
```

**Result:**

| username | theme |
|----------|-------|
| alice    | dark  |
| charlie  | dark  |

**Goal**: Find users who have email notifications enabled.

```sql
SELECT
  username,
  settings #>> '{notifications,email}' as email_notifications
FROM users
WHERE settings #> '{notifications,email}' = 'true';
-- Note: Comparing JSON boolean, so use 'true' not TRUE
```

### Example 4: Containment Queries with `@>`

**Goal**: Find all premium users.

```sql
SELECT
  username,
  metadata ->> 'premium' as premium,
  (metadata ->> 'login_count')::int as login_count
FROM users
WHERE metadata @> '{"premium": true}';
```

**Result:**

| username | premium | login_count |
|----------|---------|-------------|
| alice    | true    | 42          |
| charlie  | true    | 15          |

The `@>` operator checks if the left JSONB contains the right JSONB. This is much more efficient than extracting and comparing values.

**Goal**: Find users from USA or Canada.

```sql
SELECT
  username,
  profile #>> '{address,country}' as country
FROM users
WHERE profile @> '{"address": {"country": "USA"}}'
   OR profile @> '{"address": {"country": "Canada"}}';
```

### Example 5: Checking for Key Existence

**Goal**: Find users who have defined skills.

```sql
SELECT
  username,
  profile -> 'skills' as skills
FROM users
WHERE profile ? 'skills';
```

**Goal**: Find users who have either 'phone' or 'mobile' in their profile.

```sql
SELECT
  username,
  profile
FROM users
WHERE profile ?| array['phone', 'mobile'];
-- Returns nothing in our sample data since no one has these fields
```

### Example 6: Working with JSON Arrays

**Goal**: List all skills as separate rows for each user.

```sql
SELECT
  username,
  jsonb_array_elements_text(profile -> 'skills') as skill
FROM users;
```

**Result:**

| username | skill      |
|----------|------------|
| alice    | Python     |
| alice    | PostgreSQL |
| alice    | React      |
| bob      | Java       |
| bob      | Spring     |
| bob      | Docker     |
| charlie  | JavaScript |
| charlie  | Node.js    |
| charlie  | MongoDB    |

**Goal**: Find users who know PostgreSQL.

```sql
SELECT
  username,
  profile -> 'skills' as skills
FROM users
WHERE profile -> 'skills' @> '"PostgreSQL"';
-- Note: Must use JSON string format with quotes
```

### Example 7: Modifying JSONB Data

**Goal**: Add a new field to Charlie's profile.

```sql
UPDATE users
SET profile = profile || '{"github": "charlie-dev"}'
WHERE username = 'charlie';

-- Verify
SELECT username, profile ->> 'github' as github
FROM users
WHERE username = 'charlie';
```

**Goal**: Update a nested value (change Bob's theme to dark).

```sql
UPDATE users
SET settings = jsonb_set(
  settings,
  '{theme}',
  '"dark"'
)
WHERE username = 'bob';
```

**Goal**: Remove a field from metadata.

```sql
UPDATE users
SET metadata = metadata - 'last_login'
WHERE username = 'alice';
```

### Example 8: Aggregating JSONB Data

**Goal**: Get all unique skills across all users.

```sql
SELECT DISTINCT
  jsonb_array_elements_text(profile -> 'skills') as skill
FROM users
ORDER BY skill;
```

**Goal**: Count users by theme preference.

```sql
SELECT
  settings ->> 'theme' as theme,
  COUNT(*) as user_count
FROM users
GROUP BY settings ->> 'theme';
```

### Example 9: Building JSON from Query Results

**Goal**: Create a JSON object from relational data.

```sql
SELECT
  jsonb_build_object(
    'username', username,
    'name', profile ->> 'name',
    'city', profile #>> '{address,city}',
    'is_premium', metadata -> 'premium'
  ) as user_summary
FROM users
WHERE metadata @> '{"premium": true}';
```

**Goal**: Aggregate user data into a JSON array.

```sql
SELECT jsonb_agg(
  jsonb_build_object(
    'username', username,
    'email', profile ->> 'email'
  )
) as all_users
FROM users;
```

---

## Performance: Indexing JSONB

JSONB supports multiple index types for different query patterns.

### GIN Index (Most Common)

Best for containment queries (`@>`, `?`, `?|`, `?&`).

```sql
-- Index the entire JSONB column
CREATE INDEX idx_users_profile ON users USING GIN (profile);

-- Now this query will be fast
SELECT * FROM users WHERE profile @> '{"address": {"city": "New York"}}';
```

### Index on Specific JSON Path

For queries that frequently access a specific field.

```sql
-- Index just the email field
CREATE INDEX idx_users_email ON users ((profile ->> 'email'));

-- This query will use the index
SELECT * FROM users WHERE profile ->> 'email' = 'alice@example.com';
```

### Expression Index for Nested Paths

```sql
-- Index the city field
CREATE INDEX idx_users_city ON users ((profile #>> '{address,city}'));

SELECT * FROM users WHERE profile #>> '{address,city}' = 'London';
```

---

## Useful JSONB Functions Reference

| Function | Description | Example |
|----------|-------------|---------|
| `jsonb_object_keys()` | Get all top-level keys | `SELECT jsonb_object_keys(profile)` |
| `jsonb_each()` | Expand to key-value pairs | `SELECT * FROM jsonb_each(profile)` |
| `jsonb_array_elements()` | Expand array to rows (as JSONB) | `SELECT jsonb_array_elements('[1,2,3]')` |
| `jsonb_array_elements_text()` | Expand array to rows (as text) | `SELECT jsonb_array_elements_text('["a","b"]')` |
| `jsonb_array_length()` | Get array length | `SELECT jsonb_array_length(profile -> 'skills')` |
| `jsonb_build_object()` | Create JSONB object | `SELECT jsonb_build_object('key', 'value')` |
| `jsonb_build_array()` | Create JSONB array | `SELECT jsonb_build_array(1, 2, 3)` |
| `jsonb_set()` | Update nested value | `SELECT jsonb_set('{"a":1}', '{a}', '2')` |
| `jsonb_insert()` | Insert value at path | `SELECT jsonb_insert('{"a":1}', '{b}', '2')` |
| `jsonb_strip_nulls()` | Remove null values | `SELECT jsonb_strip_nulls('{"a":null,"b":1}')` |

---

## Best Practices

1. **Use JSONB, not JSON**: Unless you have a specific reason, always choose JSONB.
2. **Index Wisely**: Add GIN indexes to JSONB columns you frequently query.
3. **Don't Overuse JSON**: If your data has a fixed schema, use regular columns. JSON is best for truly variable data.
4. **Validate Data**: Consider using CHECK constraints with JSONB functions to validate structure.
5. **Type Casting**: Remember to cast extracted values when doing numeric operations: `(profile ->> 'age')::int`.
6. **Test Performance**: Always use `EXPLAIN ANALYZE` to verify your indexes are being used.

---

## Conclusion

PostgreSQL's JSONB support gives you the flexibility of document databases with the power of SQL. You can:

* **Store** flexible, nested data structures
* **Query** efficiently with specialized operators
* **Index** for performance
* **Combine** with traditional relational data
* **Transform** data easily with built-in functions

Start with simple queries using `->` and `->>`, then graduate to containment operators and GIN indexes. Once you're comfortable, JSONB becomes an incredibly powerful tool in your PostgreSQL toolkit.

For more details, see the official [PostgreSQL documentation on JSON Types](https://www.postgresql.org/docs/current/datatype-json.html) and [JSON Functions](https://www.postgresql.org/docs/current/functions-json.html).