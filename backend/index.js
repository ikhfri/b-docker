const express = require("express");
const { Pool } = require("pg");
const redis = require("redis");

const app = express();

// PostgreSQL
const pool = new Pool({
  host: "db",
  user: "postgres",
  password: "postgres",
  database: "mydb",
  port: 5432,
});

// Redis
const client = redis.createClient({
  url: "redis://redis:6379",
});

client.connect();

app.get("/", async (req, res) => {
  await client.set("test", "Hello Redis!");
  const redisData = await client.get("test");

  const result = await pool.query("SELECT NOW()");
  
  res.json({
    postgres: result.rows[0],
    redis: redisData,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});