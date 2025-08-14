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

    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      formData.append(key, value as string);
    }

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: `Maths Tutor Interest Form - ${validatedData.name}`,
      text: `MATHS TUTOR GROUP CLASS INTEREST FORM

YOUR DETAILS:
Learner Name: ${validatedData.name}
Parent/Guardian: ${validatedData.subject}
Year Group: ${validatedData.message}
School: ${body.school || 'Not provided'}
Phone: ${body.phone || 'Not provided'}
Email: ${validatedData.email}

CLASS PREFERENCE:
${body.classPreference || 'Not selected'}

INTERESTED IN HOMEWORK:
${body.homework || 'Not selected'}

GOALS:
${body.goals || 'Not provided'}

NOTES:
${body.notes || 'Not provided'}

Submitted: ${new Date().toLocaleString()}`,
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