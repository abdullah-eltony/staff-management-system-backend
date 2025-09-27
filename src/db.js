import { Pool } from "pg";
import config from "./config/config.js";

let pool;

async function createPool() {
  pool = new Pool(config.db);

  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL successfully");
    client.release();
  } catch (err) {
    console.error("Could not connect to PostgreSQL:", err.message);
    process.exit(-1);
  }

  pool.on("error", async (err) => {
    console.error("Unexpected error on idle client:", err.message);
    await retryConnection();
  });

  return pool;
}

async function retryConnection() {
  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    retries++;
    console.log(`🔄 Retry attempt ${retries}/${maxRetries}...`);

    try {
      pool = new Pool(config.db);
      const client = await pool.connect();
      console.log("✅ Reconnected to PostgreSQL successfully");
      client.release();
      return;
    } catch (err) {
      console.error("❌ Retry failed:", err.message);
      await new Promise((res) => setTimeout(res, retries * 2000));
    }
  }

  console.error("❌ Could not reconnect after several attempts. Exiting...");
  process.exit(-1);
}

const dbPool = await createPool();
export default dbPool;
