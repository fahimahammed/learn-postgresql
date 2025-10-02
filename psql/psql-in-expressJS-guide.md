# Using PostgreSQL in Express.js Applications: A Complete Guide 🚀

This comprehensive tutorial covers everything you need to know about integrating PostgreSQL with Express.js applications, from initial setup to advanced patterns like transactions and connection pooling.

## 📑Table of Contents

1. [⚙️ Prerequisites and Installation](#prerequisites-and-installation)
2. [🎯 Project Objectives and Context](#project-objectives-and-context)
3. [🔗 Database Connection Strategies](#database-connection-strategies)
4. [📝 Essential Query Patterns](#essential-query-patterns)
5. [📦 Complete Application Examples](#complete-application-examples)
6. [🔄 Transactions and Concurrency](#transactions-and-concurrency)
7. [🗂️ Schema Management and Migrations](#schema-management-and-migrations)
8. [✅ Best Practices](#best-practices)
9. [🛠️ Troubleshooting](#troubleshooting)
10. [📚 Additional Resources](#additional-resources)

---
## Prerequisites and Installation 

**Assumption:** From the previous guides in this repo I assume PostgreSQL server is already installed and running on your machine.

### 🛠️ Setting Up Your Node.js/Express Project

Create a new project or navigate to your existing project directory:

```bash
# Create project (if not already exists)
npm init -y

# Install essential dependencies
npm install express pg body-parser ejs dotenv
```
🔹 **`pg`** is shorthand for postgres 🐘
🔹 `npm install pg` means installing postgres as npm package to be used in express apps 🔑
### 💻 Platform-Specific Database Setup Commands

#### macOS / Linux (bash / zsh)
```bash
# Create database
psql -U postgres -d postgres -c "CREATE DATABASE world;"

# Run schema file
psql -U postgres -d world -f ./db/schema.sql
```

#### Windows (PowerShell)
```powershell
# Create database (note the single quotes)
psql -U postgres -d postgres -c 'CREATE DATABASE world;'

# Run schema file (note the backslash path separator)
psql -U postgres -d world -f .\db\schema.sql
```

**Note:** If `psql` is not in your PATH on Windows, either add the PostgreSQL bin directory to your PATH or run psql from the installation directory.

---
## Project Objectives and Context 


1. 📊 **Data Retrieval**: Load and serve static datasets for dynamic content (e.g., quiz questions)  
2. 📋 **List Management**: Read and display collections of data (items, countries, users)  
3. ➕ **Data Insertion**: Handle user-submitted data (new items, visited countries, user registration)  
4. ✏️ **Data Updates**: Modify existing records (edit items, update user preferences)  
5. 🗑️ **Data Deletion**: Remove records safely and efficiently  
6. 🔍 **Data Mapping**: Perform lookups and associations (country name → country code)  
7. 🚨 **Error Handling**: Manage duplicates and constraint violations gracefully  
8. 🔄 **Connection Management**: Maintain persistent database connections for server lifetime  
9. 👥 **Multi-user Support**: Handle user sessions and data associations between tables  


## Database Connection Strategies

The PostgreSQL Node.js driver (`pg`) offers two primary connection patterns:

### A. 🧑‍💻 Single Client Connection (`pg.Client`)

```javascript
import pg from "pg";

const client = new pg.Client(connectionString);
await client.connect();
await client.query("SELECT ...");
await client.end(); // Connection closed
```

**When to Use Client:**
🔹Short-lived scripts or migrations
🔹One-off CLI utilities
🔹Simple single-user applications

**Important Warning:** Avoid using `client.end()` in web servers, as it terminates the connection permanently.

### B. 🌐 Connection Pool (`pg.Pool`) - **Recommended for Web Applications**

```javascript
import pg from "pg";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  max: 20,                    // Maximum connections in pool
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast on connection issues
});

// Simple query
const result = await pool.query("SELECT * FROM items");
```

**Why Use Pool for Web Apps:**
🔹 Handles concurrent requests efficiently
🔹 Reuses existing connections
🔹 Automatically manages connection lifecycle
🔹 Provides better performance under load

### Transaction Example with Pool

```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users (name) VALUES ($1)', [name]);
  await client.query('INSERT INTO profiles (user_id) VALUES ($1)', [userId]);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release(); // Return connection to pool
}
```
> This you'll learn more in-depth in [Transactions and Concurrency](#transactions-and-concurrency) section
## Essential Query Patterns

**⚠️Security Rule:** Always use parameterized queries with placeholders (`$1`, `$2`) to prevent SQL injection attacks.

### 🔎 SELECT Operations 

```javascript
// Basic select
const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
const rows = result.rows;

// Parameterized select
const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
```

### ➕ INSERT Operations 

```javascript
// Insert with RETURNING clause to get inserted data
const { rows } = await pool.query(
  "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id, name, created_at",
  [name, color]
);
const newUser = rows[0];
```

### ✏️ UPDATE Operations 

```javascript
await pool.query("UPDATE items SET title = $1, updated_at = NOW() WHERE id = $2", [newTitle, itemId]);
```

### 🗑️ DELETE Operations 

```javascript
await pool.query("DELETE FROM items WHERE id = $1", [itemId]);
```

### 🚨 Error Handling Pattern 

```javascript
try {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
} catch (error) {
  console.error("Database query failed:", error);
  throw new Error("User lookup failed");
}
```

###  ⚡Prepared Statements (Performance Optimization) 

```javascript
await pool.query({
  name: 'fetch-user-by-id',
  text: 'SELECT * FROM users WHERE id = $1',
  values: [userId]
});
```

## Complete Application Examples

### 🗄️Shared Database Configuration (`db.js`)

```javascript
// db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  max: 20,
});

export default pool;
```

### i. ✔️ To-Do Application 

A simple task management application demonstrating basic CRUD operations:

```javascript
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "your_password",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Fetch all items from database
async function getItemList() {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  return result.rows;
}

// Display all items
app.get("/", async (req, res) => {
  const items = await getItemList();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

// Add new item
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

// Update existing item
app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [itemTitle, itemId]);
  res.redirect("/");
});

// Delete item
app.post("/delete", async (req, res) => {
  const itemId = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [itemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### ii. 🌍 Travel Tracker Application 

A travel tracking app demonstrating country lookups and constraint handling:

```javascript
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Get list of visited countries
async function getVisitedCountries() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  
  // Extract country codes from result objects
  const countries = result.rows.map(row => row.country_code);
  return countries;
}

// Display travel dashboard
app.get("/", async (req, res) => {
  try {
    const countries = await getVisitedCountries();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
    });
  } catch (error) {
    console.error("Error loading countries:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add new visited country
app.post("/add", async (req, res) => {
  const newCountry = req.body.country;
  
  try {
    // Look up country code by name (case-insensitive partial match)
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [newCountry.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      throw new Error("Country not found");
    }
    
    const countryCode = result.rows[0].country_code;
    
    try {
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
      res.redirect("/");
    } catch (insertError) {
      // Handle duplicate country constraint
      const countries = await getVisitedCountries();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: 'Country already visited. Please add a new country.',
      });
    }
  } catch (lookupError) {
    const countries = await getVisitedCountries();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: 'Country does not exist. Please try again.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

### iii. ❓ Quiz Application 

A geography quiz demonstrating data preloading and random selection:

```javascript
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Load quiz data on startup
let quizData = [];
let totalCorrect = 0;
let currentQuestion = {};

async function loadQuizData() {
  await db.connect();
  try {
    const result = await db.query("SELECT * FROM capitals");
    quizData = result.rows;
    console.log(`Loaded ${quizData.length} quiz questions`);
  } catch (error) {
    console.error("Error loading quiz data:", error);
  }
}

// Initialize quiz data
loadQuizData();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Generate random question
function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * quizData.length);
  return quizData[randomIndex];
}

// Start new quiz
app.get("/", (req, res) => {
  totalCorrect = 0;
  currentQuestion = getRandomQuestion();
  res.render("index.ejs", { 
    question: currentQuestion,
    totalScore: totalCorrect
  });
});

// Process answer submission
app.post("/submit", (req, res) => {
  const userAnswer = req.body.answer.trim();
  let isCorrect = false;
  
  if (currentQuestion.capital.toLowerCase() === userAnswer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }
  
  // Generate next question
  currentQuestion = getRandomQuestion();
  
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```
## Transactions and Concurrency

Use transactions when multiple database operations must succeed or fail together:

### 🧩Transaction Pattern

```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  
  // Multiple related operations
  const userResult = await client.query(
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
    [name, email]
  );
  const userId = userResult.rows[0].id;
  
  await client.query(
    'INSERT INTO user_profiles (user_id, bio) VALUES ($1, $2)',
    [userId, bio]
  );
  
  await client.query('COMMIT');
  return userId;
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

### ✅ Concurrency Best Practices

🔹 Keep transactions short to minimize lock contention
🔹 Avoid long-running operations within transactions
🔹 Use appropriate isolation levels when needed
🔹 Handle deadlock scenarios with retry logic

## Schema Management and Migrations

### 🏗️ Development Setup 

For development environments, you can use SQL files:

```bash
# Create schema
psql -U postgres -d your_database -f ./db/schema.sql

# Seed initial data
psql -U postgres -d your_database -f ./db/seed.sql
```

###  🚚 Production Migration Tools 

For production applications, consider these migration tools:

 🔹**node-pg-migrate**: Lightweight PostgreSQL migration tool  
 🔹**Knex.js**: Query builder with migration support  
 🔹**Sequelize**: ORM with built-in migration system  
 🔹**Prisma**: Modern ORM with declarative migrations  


## Best Practices 

###  📌 Essential Guidelines 

1. **Connection Management** 🔗 
   🔹 Use `pg.Pool` for web applications 
   🔹Use `pg.Client` only for scripts and utilities 
   🔹Close pools gracefully on application shutdown 

2.  **Security** 🔒
   🔹 Always use parameterized queries (`$1`, `$2`) 
   🔹Never use string interpolation for SQL 
   🔹Store credentials in environment variables 
   🔹Validate input before database operations 

3.  **Error Handling** 🚨
   🔹Handle unique constraint violations gracefully 
   🔹 Provide user-friendly error messages 
   🔹 Log detailed errors for debugging 
   🔹Use try-catch blocks around database operations 

4.  **Performance** ⚡
   🔹 Use `RETURNING` clause to fetch inserted data 
   🔹 Keep transactions short and focused 
   🔹 Consider connection pooling configuration 
   🔹Use prepared statements for repeated queries 

5.  **Code Organization** 🗂️
   🔹 Separate database configuration into modules 
   🔹Use environment variables for configuration 
   🔹Implement proper logging 
   🔹 Consider using ORMs for complex applications 

### 🌙 Graceful Shutdown Pattern 


```javascript
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
```

## Troubleshooting

### ⚠️ Common Issues and Solutions 

**ECONNREFUSED Error** ❌
🔹 Verify PostgreSQL server is running
🔹 Check `DB_HOST` and `DB_PORT` configuration
🔹 Ensure firewall allows database connections

**Authentication Failures** 🔑
```
role "postgres" does not exist
```
🔹 Verify database username in configuration
🔹 Create the user or update environment variables
🔹 Check password accuracy

**Windows psql Issues** 💻
```
'psql' is not recognized as an internal or external command
```
🔹 Add PostgreSQL bin directory to system PATH
🔹 Use full path to psql executable
🔹 Use pgAdmin as alternative

**Unique Constraint Violations** 🚫
```javascript
try {
  await pool.query("INSERT INTO users (email) VALUES ($1)", [email]);
} catch (error) {
  if (error.code === '23505') { // Unique violation
    return { error: 'Email already exists' };
  }
  throw error;
}
```

**Connection Pool Exhaustion**
🔹 Ensure connections are properly released
🔹 Adjust pool size based on application needs
🔹 Monitor connection usage patterns

## Additional Resources

### 📖 Official Documentation
🔹 [node-postgres (pg) Documentation](https://node-postgres.com/)
🔹 [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)

### 🛠️ Migration and ORM Tools
🔹 [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
🔹 [Knex.js](https://knexjs.org/)
🔹 [Prisma](https://www.prisma.io/)
🔹 [Sequelize](https://sequelize.org/)

### 🧠 Advanced Topics
🔹 PostgreSQL performance tuning
🔹 Connection pooling optimization
🔹 Advanced transaction patterns
🔹 Database monitoring and logging

---
## Final Notes ✨
This guide provides a solid foundation for integrating PostgreSQL with Express.js applications. Start with the basic patterns and gradually incorporate advanced features as your application grows in complexity.

---
## Acknowledgment 🙏

The contents of this document are entirely handwritten and have been properly formatted into a Markdown file with the assistance of ChatGPT.
