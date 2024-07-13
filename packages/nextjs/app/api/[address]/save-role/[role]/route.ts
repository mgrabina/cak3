// app/api/[address]/save-role/[role]/route.ts
import { NextResponse } from "next/server";
import { insertProof } from "~~/lib/db";

// Adjust the import path as needed

export async function POST(req: Request, { params }: { params: { address: string; role: string } }) {
  console.log("Saving role", req, params);

  const { address, role } = params;
  const proof = await req.text();

  console.log("content", proof);

  if (!address || !proof || !role) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  console.log("Inserting proof", address, proof, role);
  const newProof = await insertProof(address, JSON.stringify(proof), role);

  return NextResponse.json({ status: "Success", proof: newProof }, { status: 200 });
}
