import "dotenv/config";
import argon2 from "argon2";
import { Client } from "pg";

const connectionString = process.env.DB_URL;
const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";

if (!connectionString) {
  throw new Error("DB_URL is required. Set it in server/.env first.");
}

const client = new Client({ connectionString });

try {
  await client.connect();

  const passwordHash = await argon2.hash(adminPassword);
  const result = await client.query(
    `INSERT INTO users (name, email, role, password_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    ["Admin", "admin@mail.com", "admin", passwordHash],
  );

  if (result.rowCount === 1) {
    console.log("Created admin user admin@mail.com.");
  } else {
    console.log(
      "admin@mail.com already exists; left its name, role, and password unchanged.",
    );
  }
} finally {
  await client.end();
}
