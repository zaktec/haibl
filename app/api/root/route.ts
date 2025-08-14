import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { mailFormSchema } from '@/app/utils/validation/mail-form';

export async function POST(request: NextRequest) {
  console.log('API route called');
  try {
    const body = await request.json();
    console.log('Request body:', body);
    let validatedData;
    try {
      validatedData = mailFormSchema.parse(body);
    } catch (validationError: unknown) {
      return NextResponse.json(
        { success: false, errorMessage: validationError instanceof Error ? validationError.message : 'Validation failed' },
        { status: 400 }
      );
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.log('Missing credentials:', { user: !!process.env.MAIL_USER, pass: !!process.env.MAIL_PASS });
      return NextResponse.json(
        { success: false, errorMessage: 'Mail credentials not configured' },
        { status: 500 }
      );
    }

    console.log('Using credentials:', { user: process.env.MAIL_USER });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: `New message from ${validatedData.name}`,
      text: `Name: ${validatedData.name}
Email: ${validatedData.email}
Subject: ${validatedData.subject}
Message: ${validatedData.message}`,
    });

    console.log('Email sent successfully');
    return NextResponse.json({ success: true, errorMessage: null });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, errorMessage: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}