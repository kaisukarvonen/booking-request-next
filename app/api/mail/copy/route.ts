import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const { email, title, html } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_SENDER_PW,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: title,
      html,
    });
    return NextResponse.json(info);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
