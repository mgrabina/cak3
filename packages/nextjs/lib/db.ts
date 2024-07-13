// lib/db.ts
import { createClient, createPool } from "@vercel/postgres";

const client = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export async function setup() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ZKProofs (
      address VARCHAR(255) NOT NULL,
      proof TEXT NOT NULL,
      role VARCHAR(255) NOT NULL
    )
  `);
}

export async function insertProof(address: string, proof: string, role: string) {
  await setup();

  const result = await client.query("INSERT INTO ZKProofs (address, proof, role) VALUES ($1, $2, $3) RETURNING *", [
    address,
    proof,
    role,
  ]);
  return result.rows[0];
}

export async function getProofsByAddress(address: string) {
  await setup();

  const result = await client.query("SELECT * FROM ZKProofs WHERE address = $1", [address]);
  return result.rows;
}
