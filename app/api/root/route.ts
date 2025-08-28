import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { mailFormSchema } from '@/app/utils/validation/mail-form';
import { ERROR_MESSAGES } from '@/app/utils/validation/errors';

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
        { success: false, errorMessage: validationError instanceof Error ? validationError.message : ERROR_MESSAGES.VALIDATION_FAILED },
        { status: 400 }
      );
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.log('Missing credentials - logging form data instead:', validatedData);
      // Log the form submission for now
      console.log('FORM SUBMISSION:', JSON.stringify(validatedData, null, 2));
      return NextResponse.json(
        { success: true, errorMessage: 'Form submitted successfully (email not configured)' },
        { status: 200 }
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
      subject: `Maths Tutor Interest Form - ${validatedData.learnerName}`,
      text: `MATHS TUTOR GROUP CLASS BOOKING FORM

YOUR DETAILS:
Learner Name: ${validatedData.learnerName}
Parent/Guardian: ${validatedData.parentName}
Year Group: ${validatedData.yeargroup}
School: ${body.school || 'Not provided'}
Phone: ${body.phone || 'Not provided'}
Email: ${validatedData.email || 'Not provided'}

CLASS PREFERENCE:
${body.classPreference || 'Not selected'}

TARGET GRADE:
${body.targetGrade || 'Not selected'}

INTERESTED IN HOMEWORK:
${body.homework || 'Not selected'}

TRAVEL ARRANGEMENTS:
${body.travelArrangement || 'Not selected'}

BOOKING OPTION:
${body.bookingOption || 'Not selected'}

PAYMENT PREFERENCE:
${body.paymentPreference || 'Not selected'}

GOALS:
${body.goals || 'Not provided'}

MATHS SET:
${body.mathsSet || 'Not provided'}

NOTES:
${body.notes || 'Not provided'}

PROMOTIONAL CONSENT:
${body.promotionalConsent || 'Not selected'}

COMMUNICATION METHOD:
${body.communicationMethod || 'Not selected'}${body.communicationOther ? ` - ${body.communicationOther}` : ''}

TERMS ACCEPTED:
${body.termsAccepted ? 'Yes' : 'No'}

Submitted: ${new Date().toLocaleString()}`,
    });

    console.log('Email sent successfully');
    return NextResponse.json({ success: true, errorMessage: null });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, errorMessage: `${ERROR_MESSAGES.FAILED_TO_SEND_EMAIL}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR}` },
      { status: 500 }
    );
  }
}