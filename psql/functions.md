# PostgreSQL Functions & Stored Procedures

PostgreSQL provides powerful support for creating **functions** and **stored procedures** to encapsulate SQL logic, improve code reusability, and optimize performance. Functions can return values, while stored procedures can perform actions without necessarily returning data.

---

## Types of Functions

- **SQL Functions**: Written directly in SQL.
- **PL/pgSQL Functions**: Use PostgreSQL’s procedural language for more complex logic.
- **Trigger Functions**: Special functions invoked automatically by triggers.

---

## Creating a Function

```sql
CREATE FUNCTION add_numbers(a INT, b INT)
RETURNS INT AS $$
BEGIN
  RETURN a + b;
END;
$$ LANGUAGE plpgsql;
````

**Usage:**

```sql
SELECT add_numbers(5, 10);
```

---

## Stored Procedures

Stored procedures are similar to functions but are called using the `CALL` statement and can perform transactions.

```sql
CREATE PROCEDURE log_message(msg TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO logs(message, created_at) VALUES (msg, NOW());
END;
$$;
```

**Usage:**

```sql
CALL log_message('Database operation completed');
```

---

## Triggers with Functions

You can use functions as **triggers** to automate actions:

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

---

## Best Practices

* Use `plpgsql` for procedural logic.
* Keep functions modular and reusable.
* Add exception handling for reliability.
* Use triggers carefully to avoid hidden performance issues.