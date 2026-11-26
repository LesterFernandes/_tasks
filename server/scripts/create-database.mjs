import "dotenv/config";
import { Client } from "pg";

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error("DB_URL is required. Set it in server/.env first.");
}

const targetUrl = new URL(connectionString);
const databaseName = decodeURIComponent(targetUrl.pathname.slice(1));

if (!databaseName) {
  throw new Error("DB_URL must include the database name in its path.");
}

// CREATE DATABASE must run while connected to a different database.
targetUrl.pathname = "/postgres";
const client = new Client({ connectionString: targetUrl.toString() });

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

try {
  await client.connect();
  const existing = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [databaseName],
  );

  if (existing.rowCount > 0) {
    console.log(`Database ${databaseName} already exists.`);
  } else {
    await client.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
    console.log(`Created database ${databaseName}.`);
  }
} finally {
  await client.end();
}
