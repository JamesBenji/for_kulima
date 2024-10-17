import { NextRequest, NextResponse } from "next/server";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "devmail.impactug@gmail.com",
    pass: "lwmdnbolircegfxr",
  },
});

async function send_mail(email: string) {
  if (!email) return;

  const info = await transporter.sendMail({
    from: "Kulima Team <devmail.impactug@gmail.com>",
    to: email,
    subject: "Account access granted",
    html: "<div><h3>Hello!</h3><p>We are pleased to inform you that you have been granted access to Kulima. Feel free to login at any time. For any inquiries, please reply to this email.</p><a href='for-kulima.vercel.app/sign-in'>Log in</a></div>", // html body
  });
}

export async function POST(req: NextRequest) {
  try {
    const receivedJSON = await req.json();

    if (receivedJSON.email) {
      await send_mail(receivedJSON.email);
      return NextResponse.json(
        {
          message: "success",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
