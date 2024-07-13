// app/api/send-invite-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { env } from "~~/types/env";

const founderLink = "https://issuer-ui.polygonid.me/credentials/scan-link/4a2c016e-0ef0-4f7b-a8af-2632da388086";
const investorLink = "https://issuer-ui.polygonid.me/credentials/scan-link/c88e62ee-8c25-4422-81cb-018181890254";
const employeeLink = "https://issuer-ui.polygonid.me/credentials/scan-link/dffef1f5-3cb6-41a6-8abb-2f0927bed010";

export async function POST(req: NextRequest) {
  const { email, role } = await req.json();

  const msg = {
    to: email,
    from: "email_service@targecy.xyz", // Your verified SendGrid email
    subject: "You are invited to Acme as " + role,
    text: `Hello anon,

    You have been invited to join Acme company.
    
    Please click the following link and scan the QR code to get your role credential:

    ${role === "founder" ? founderLink : role === "investor" ? investorLink : employeeLink}

    Best regards,
    Acme`,
  };

  try {
    const resend = new Resend(env.RESEND_API_KEY);

    const res = await resend.emails.send({
      from: msg.from,
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
    });
    if (res.error) {
      console.error(res.error);
      return NextResponse.json({ message: "Error sending email", error: res.error }, { status: 500 });
    }
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error sending email", error }, { status: 500 });
  }
}
