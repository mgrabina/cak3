// app/api/send-invite-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { env } from "~~/types/env";

export async function POST(req: NextRequest) {
  const { name, email, amount, valuation } = await req.json();

  const msg = {
    to: email,
    from: "email_service@targecy.xyz", // Your verified SendGrid email
    subject: "You are invited as an investor",
    text: `Hello ${name},

    You have been invited to join our fundraising round.
    
    Details:
    - Amount: ${amount}
    - Valuation: ${valuation}
    
    Please complete the operation here: ${
      env.NEXT_PUBLIC_VERCEL_ENV === "production" || env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        ? "https://cak3.vercel.app/fundraising/invest?invite=" +
          randomUUID() +
          "&email=" +
          email +
          "&amount=" +
          amount +
          "&valuation=" +
          valuation
        : "http://localhost:3000/fundraising/invest?invite=" +
          randomUUID() +
          "&email=" +
          email +
          "&amount=" +
          amount +
          "&valuation=" +
          valuation
    }

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
