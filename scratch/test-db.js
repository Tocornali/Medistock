
const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_AUg2ly8pOXjE@ep-spring-wildflower-an8kra6j-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
  });
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

testConnection();
