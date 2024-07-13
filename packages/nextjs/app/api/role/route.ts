import { NextResponse } from "next/server";
import { status } from "nprogress";
import { getProofsByAddress } from "~~/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address || Array.isArray(address)) {
    return NextResponse.json({ status: 400, error: "Address is required" });
  }

  const proofs = await getProofsByAddress(address);
  return NextResponse.json({
    status: 200,
    data: proofs,
  });
}
