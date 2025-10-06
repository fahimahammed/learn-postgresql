# PostgreSQL Intermediate Questions and Answers (Realistic Scenarios)

---

## 1. Scenario: E-commerce Revenue Analysis

**Context:**  
You work as a data analyst for an online retail company that sells electronics, clothing, and home goods. The `orders` table records every sale, including `order_id`, `product_id`, `quantity`, `price`, and `order_date`. Management wants to understand which products generated the most revenue last month so they can plan targeted promotions and inventory restocking.

**Question:**  
Write a query to identify the top 3 products by total revenue for the previous month.

**Answer:**  
```
SELECT product_id, SUM(quantity * price) AS total_revenue
FROM orders
WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND order_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY product_id
ORDER BY total_revenue DESC
LIMIT 3;
````

**Explanation**

* `SUM(quantity * price)` calculates revenue per product.
* `DATE_TRUNC` ensures we only look at last month’s orders.
* `GROUP BY product_id` aggregates revenue by product.
* `ORDER BY total_revenue DESC` ranks products, and `LIMIT 3` selects the top 3.

---

## 2. Scenario: Employee Salary Analysis

**Context:**
Your HR department wants to compare salaries across departments to identify areas where pay may be below average. The `employees` table has `employee_id`, `department_id`, `salary`, and `hire_date`. HR wants a report showing each department’s average salary.

**Question:**
Write a query to calculate the average salary for each department.

**Answer:**

```
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
ORDER BY avg_salary ASC;
```

**Explanation:**

* `AVG(salary)` calculates the average salary in each department.
* `GROUP BY department_id` ensures aggregation per department.
* `ORDER BY avg_salary ASC` allows HR to easily spot departments with the lowest averages.

---

## 3. Scenario: Products Never Ordered

**Context:**
The marketing team wants to promote underperforming products. The `products` table lists all items, and the `orders` table logs every purchase. The goal is to identify products that **have never been ordered** to prioritize them for promotions.

**Question:**
Write a query to find all products that have never been sold.

**Answer:**

```
SELECT p.product_id, p.product_name
FROM products p
LEFT JOIN orders o ON p.product_id = o.product_id
WHERE o.product_id IS NULL;
```

**Explanation:**

* `LEFT JOIN` keeps all products while linking any matching orders.
* `WHERE o.product_id IS NULL` filters only products with no orders.
* This allows marketing to identify items for special campaigns.

---

## 4. Scenario: Monthly Sales Trends

**Context:**
The sales team wants to analyze **monthly revenue trends** for the current year to detect seasonality. The `orders` table contains `order_date` and `total_amount`. They need monthly totals to create a dashboard chart.

**Question:**
Write a query to calculate total sales per month for the current year.

**Answer:**

```
SELECT DATE_TRUNC('month', order_date) AS month, SUM(total_amount) AS monthly_sales
FROM orders
WHERE EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY month
ORDER BY month;
```

**Explanation:**

* `DATE_TRUNC('month', order_date)` groups sales by month.
* `SUM(total_amount)` calculates total sales per month.
* Filtering by year ensures only current-year data is included.
* `ORDER BY month` allows trend visualization.

---

## 5. Scenario: Loyal Customers

**Context:**
The marketing team wants to reward loyal customers. A loyal customer is defined as someone who **placed at least one order in each of the last three months**. The `orders` table records `customer_id` and `order_date`.

**Question:**
Write a query to find all loyal customers.

**Answer:**

```
SELECT customer_id
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY customer_id
HAVING COUNT(DISTINCT DATE_TRUNC('month', order_date)) = 3;
```

**Explanation:**

* `DATE_TRUNC('month', order_date)` ensures we count distinct months.
* `HAVING COUNT(DISTINCT ...) = 3` filters customers with orders in all three months.
* This query helps identify customers eligible for loyalty rewards.

---

## 6. Scenario: Late Shipments

**Context:**
The operations team wants to monitor late shipments. The `orders` table includes `order_id`, `shipped_date`, and `promised_date`. Late shipments occur when `shipped_date` is after `promised_date`.

**Question:**
Write a query to identify all late orders.

**Answer:**

```
SELECT order_id, shipped_date, promised_date
FROM orders
WHERE shipped_date > promised_date;
```

**Explanation:**

* Simple comparison identifies late shipments.
* Helps operations prioritize customer communications or investigate delays.

---

## 7. Scenario: Average Payment by Type

**Context:**
The finance department wants to understand **average transaction amounts** for each payment type (credit card, PayPal, etc.). The `payments` table contains `payment_type` and `amount`.

**Question:**
Write a query to calculate the average payment amount per payment type.

**Answer:**

```
SELECT payment_type, AVG(amount) AS avg_payment
FROM payments
GROUP BY payment_type
ORDER BY avg_payment DESC;
```

**Explanation:**

* `AVG(amount)` calculates the average per payment type.
* `GROUP BY` ensures correct aggregation.
* `ORDER BY DESC` highlights payment methods with the highest average transaction.

---

## 8. Scenario: Inventory Alert

**Context:**
Warehouse managers need a report of products that need restocking. The `products` table contains `product_id`, `product_name`, `stock_quantity`, and `reorder_level`. Any product where `stock_quantity` is less than `reorder_level` should be flagged.

**Question:**
Write a query to list all products that need restocking.

**Answer:**

```
SELECT product_id, product_name, stock_quantity, reorder_level
FROM products
WHERE stock_quantity < reorder_level
ORDER BY stock_quantity ASC;
```

**Explanation:**

* Filters products that are below the reorder level.
* Sorting by `stock_quantity` prioritizes the most urgent restocks.

---

## 9. Scenario: Upcoming Subscription Expirations

**Context:**
The subscription team wants to notify users whose subscriptions will **expire in the next 7 days**. The `subscriptions` table includes `user_id` and `subscription_end`.

**Question:**
Write a query to find users with subscriptions expiring soon.

**Answer:**

```
SELECT user_id, subscription_end
FROM subscriptions
WHERE subscription_end BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';
```

**Explanation:**

* `BETWEEN` efficiently captures the 7-day window.
* This query allows automated notifications or renewal reminders to be sent.

---

## 10. Scenario: High-Value Customers

**Context:**
Management wants to identify **customers who have spent more than $10,000 total** in the past year to offer them special deals. The `orders` table has `customer_id`, `order_date`, and `total_amount`.

**Question:**
Write a query to find all high-value customers.

**Answer:**

```
SELECT customer_id, SUM(total_amount) AS total_spent
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY customer_id
HAVING SUM(total_amount) > 10000;
```

**Explanation:**

* `SUM(total_amount)` calculates total spend per customer.
* `GROUP BY customer_id` aggregates by customer.
* `HAVING` filters only customers who exceed the $10,000 threshold.
* Useful for identifying VIPs for loyalty programs or marketing campaigns.




## 11. Scenario: Employee Hierarchy

**Context:**  
Your company wants to generate an organizational chart. The `employees` table contains `employee_id`, `name`, and `manager_id`. Each employee may have a manager, who is also listed in the same table. You need a report showing each employee alongside their manager.

**Question:**  
Write a query to list employees and their managers.

**Answer:**  
```sql
SELECT e.name AS employee_name, m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
````

**Explanation:**

* A **self-join** allows you to match employees with their managers.
* `LEFT JOIN` ensures employees without managers are still included.
* This query is useful for building organizational charts or reporting hierarchies.

---

## 12. Scenario: Top Customers by Order Count

**Context:**
The marketing team wants to identify the most active customers. The `orders` table contains `customer_id` and `order_id`. Knowing the top customers by order frequency can help target loyalty campaigns.

**Question:**
Write a query to find the top 5 customers with the highest number of orders.

**Answer:**

```
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
ORDER BY order_count DESC
LIMIT 5;
```

**Explanation:**

* `COUNT(*)` tallies orders per customer.
* `GROUP BY` ensures proper aggregation.
* `ORDER BY DESC` ranks customers by activity.
* `LIMIT 5` selects only the top 5.

---

## 13. Scenario: Month-over-Month Sales Growth

**Context:**
The finance team wants to track sales growth over time. The `orders` table has `order_date` and `total_amount`. They need to calculate the percentage change in monthly sales compared to the previous month.

**Question:**
Write a query to calculate month-over-month sales growth.

**Answer:**

```
WITH monthly_sales AS (
    SELECT DATE_TRUNC('month', order_date) AS month, SUM(total_amount) AS sales
    FROM orders
    GROUP BY month
)
SELECT month, sales,
       LAG(sales) OVER (ORDER BY month) AS prev_sales,
       ROUND(((sales - LAG(sales) OVER (ORDER BY month)) / LAG(sales) OVER (ORDER BY month) * 100), 2) AS growth_percentage
FROM monthly_sales;
```

**Explanation:**

* `LAG()` retrieves the previous month’s sales.
* The calculation `(sales - prev_sales)/prev_sales` gives growth percentage.
* This helps finance detect trends or seasonality in revenue.

---

## 14. Scenario: Students Enrolled in All Courses

**Context:**
The registrar’s office wants to find students who are enrolled in **every course offered in Fall 2025**. The `enrollments` table contains `student_id`, `course_id`, and `semester`.

**Question:**
Write a query to identify students enrolled in all courses for Fall 2025.

**Answer:**

```
SELECT student_id
FROM enrollments
WHERE semester = 'Fall 2025'
GROUP BY student_id
HAVING COUNT(DISTINCT course_id) = (SELECT COUNT(*) FROM courses WHERE semester = 'Fall 2025');
```

**Explanation:**

* Counts the number of distinct courses per student.
* Compares with the total courses offered in that semester.
* Students matching the count are enrolled in all courses.

---

## 15. Scenario: Popular Social Media Posts

**Context:**
A social media company wants to identify **high-engagement posts**. The `posts` table contains `post_id` and `likes`. Posts with more than 100 likes are considered popular.

**Question:**
Write a query to count the number of popular posts.

**Answer:**

```sql
SELECT COUNT(*) AS popular_posts
FROM posts
WHERE likes > 100;
```

**Explanation:**

* Filters posts exceeding 100 likes.
* Counts the total to report on engagement.
* Useful for content strategy analysis.

---

## 16. Scenario: Discount Application

**Context:**
The sales team wants to apply a **15% discount** to all products in the Electronics category. The `products` table contains `product_id`, `category`, and `price`.

**Question:**
Write a query to apply the discount.

**Answer:**

```
UPDATE products
SET price = price * 0.85
WHERE category = 'Electronics';
```

**Explanation:**
* Multiplies the current price by 0.85 to reduce 15%.
* The `WHERE` clause ensures only electronics are affected.
* This is a common bulk update scenario in retail.

---

## 17. Scenario: High-Value Bank Accounts

**Context:**
A bank wants to flag accounts with **total deposits exceeding $10,000 last month**. The `transactions` table contains `account_id`, `transaction_type`, `amount`, and `transaction_date`.

**Question:**
Write a query to find these high-value accounts.

**Answer:**

```
SELECT account_id, SUM(amount) AS total_deposits
FROM transactions
WHERE transaction_type = 'deposit'
  AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
GROUP BY account_id
HAVING SUM(amount) > 10000;
```

**Explanation:**
* Aggregates deposits per account.
* Filters last month using `DATE_TRUNC`.
* `HAVING` filters only high-value totals.

---

## 18. Scenario: Movies Never Rented

**Context:**
A video rental company wants to identify **unused movies**. The `movies` table contains `movie_id` and `title`. The `rentals` table records rented movies.

**Question:**
Write a query to find movies never rented.

**Answer:**

```
SELECT m.movie_id, m.title
FROM movies m
LEFT JOIN rentals r ON m.movie_id = r.movie_id
WHERE r.rental_id IS NULL;
```

**Explanation:**

* `LEFT JOIN` keeps all movies.
* Null rentals indicate movies never rented.
* Helps marketing decide which titles to promote.

---

## 19. Scenario: Employee Bonus Calculation

**Context:**
The HR department wants to calculate a **10% bonus** for all employees in the Sales department. The `employees` table contains `name`, `department`, and `salary`.

**Question:**
Write a query to calculate the bonus for Sales employees.

**Answer:**
```
SELECT name, salary, salary * 0.10 AS bonus
FROM employees
WHERE department = 'Sales';
```

**Explanation:**
* Multiplies salary by 0.10 to compute bonus.
* `WHERE` filters the Sales department.
* Useful for payroll calculations.

---

## 20. Scenario: Event Attendance

**Context:**
Event organizers need a report of **attendees per event**. The `registrations` table contains `event_id` and `attendee_id`.

**Question:**
Write a query to count attendees per event.

**Answer:**
```
SELECT event_id, COUNT(*) AS attendee_count
FROM registrations
GROUP BY event_id;
```

**Explanation:**

* Aggregates registrations by event.
* `COUNT(*)` gives the number of attendees.
* Supports event planning and resource allocation.

---

## 21. Scenario: Customers with Consecutive Orders

**Context:**
The marketing team wants to identify **customers who placed orders in each of the last three months** for loyalty rewards. The `orders` table contains `customer_id` and `order_date`.

**Question:**
Write a query to find these customers.

**Answer:**
```
SELECT customer_id
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY customer_id
HAVING COUNT(DISTINCT DATE_TRUNC('month', order_date)) = 3;
```

**Explanation:**
* Ensures each month counts only once per customer.
* `HAVING` filters for orders in all three months.
* Identifies consistent, loyal customers.

---

## 22. Scenario: Low Stock Alerts

**Context:**
The warehouse needs a list of products that are below the reorder threshold. The `products` table contains `product_id`, `product_name`, `stock_quantity`, and `reorder_level`.

**Question:**
Write a query to list products that need restocking.

**Answer:**
```
SELECT product_id, product_name, stock_quantity, reorder_level
FROM products
WHERE stock_quantity < reorder_level;
```

**Explanation:**
* Filters products below reorder level.
* Supports timely restocking decisions.

---

## 23. Scenario: Room Availability

**Context:**
A hotel needs to find rooms available for a specific date range. The `rooms` table lists `room_id`, and the `bookings` table records `room_id`, `start_date`, and `end_date`.

**Question:**
Write a query to find available rooms between `2025-10-15` and `2025-10-20`.

**Answer:**
```
SELECT room_id
FROM rooms
WHERE room_id NOT IN (
    SELECT room_id
    FROM bookings
    WHERE start_date < '2025-10-20' AND end_date > '2025-10-15'
);
```

**Explanation:**
* Excludes rooms already booked in the range.
* Returns only available rooms.
* Useful for booking systems.

---

## 24. Scenario: Active Streaming Users

**Context:**
A streaming service wants to identify **users who watched more than 10 movies in September 2025**. The `watch_history` table contains `user_id` and `watch_date`.

**Question:**
Write a query to find these active users.

**Answer:**
```
SELECT user_id, COUNT(*) AS movies_watched
FROM watch_history
WHERE watch_date BETWEEN '2025-09-01' AND '2025-09-30'
GROUP BY user_id
HAVING COUNT(*) > 10;
```

**Explanation:**
* Aggregates number of movies watched per user.
* Filters for September 2025.
* `HAVING` ensures only users with more than 10 movies are included.

---

## 25. Scenario: Daily Popular Dish

**Context:**
A restaurant wants to know the **most ordered dish per day**. The `orders` table contains `order_date` and `dish_id`.

**Question:**
Write a query to count orders for each dish per day.

**Answer:**
```
SELECT order_date, dish_id, COUNT(*) AS dish_count
FROM orders
GROUP BY order_date, dish_id
ORDER BY order_date, dish_count DESC;
```

**Explanation:**
* Counts dish orders per day.
* Sorting helps identify daily favorites.
* Useful for menu planning.

---

## 26. Scenario: Properties Above City Average

**Context:**
A real estate platform wants to highlight **properties priced above the city average**. The `properties` table contains `property_id`, `city`, and `price`.

**Question:**
Write a query to list properties exceeding the average price in their city.

**Answer:**

```
SELECT property_id, city, price
FROM properties p
WHERE price > (SELECT AVG(price) FROM properties WHERE city = p.city);
```

**Explanation:**

* Subquery calculates average city price.
* Filters properties above average.
* Helps highlight premium listings.

---

## 27. Scenario: Employees Without Leave

**Context:**
HR wants to identify employees who **haven’t taken any leave this year**. The `employees` table contains `employee_id` and `name`, while the `leaves` table contains `employee_id` and `start_date`.

**Question:**
Write a query to find employees with no leaves.

**Answer:**
```
SELECT e.employee_id, e.name
FROM employees e
LEFT JOIN leaves l ON e.employee_id = l.employee_id
  AND EXTRACT(YEAR FROM l.start_date) = EXTRACT(YEAR FROM CURRENT_DATE)
WHERE l.leave_id IS NULL;
```

**Explanation:**

* `LEFT JOIN` includes all employees.
* Null entries indicate no leaves.
* Useful for tracking attendance and leave policies.

---

## 28. Scenario: Customers Buying Multiple Products

**Context:**
Marketing wants to target customers who bought **both Product A and Product B**. The `orders` table contains `customer_id` and `product_id`.

**Question:**
Write a query to identify such customers.

**Answer:**
```
SELECT customer_id
FROM orders
WHERE product_id IN ('Product A', 'Product B')
GROUP BY customer_id
HAVING COUNT(DISTINCT product_id) = 2;
```

**Explanation:**
* `COUNT(DISTINCT product_id) = 2` ensures both products were purchased.
* Helps in cross-selling campaigns.

---

## 29. Scenario: Top Paying Departments

**Context:**
Finance wants to find departments where the **average salary exceeds the company average**. The `employees` table contains `department_id` and `salary`.

**Question:**
Write a query to identify these departments.

**Answer:**
```
WITH company_avg AS (
    SELECT AVG(salary) AS avg_salary FROM employees
)
SELECT department_id, AVG(salary) AS dept_avg
FROM employees, company_avg
GROUP BY department_id
HAVING AVG(salary) > company_avg.avg_salary;
```

**Explanation:**

* Calculates company-wide average salary with a CTE.
* Filters departments exceeding that average.
* Useful for budgeting and compensation reviews.

---

## 30. Scenario: Highly Active Customers

**Context:**
A retail platform wants to identify customers who placed orders in **at least 10 different months** of the past year. The `orders` table contains `customer_id` and `order_date`.

**Question:**
Write a query to find these highly active customers.

**Answer:**
```
SELECT customer_id
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY customer_id
HAVING COUNT(DISTINCT DATE_TRUNC('month', order_date)) >= 10;
```

**Explanation:**
* Aggregates months with at least one order per customer.
* `HAVING` filters only customers active in 10+ months.
* Useful for VIP programs or retention campaigns.


