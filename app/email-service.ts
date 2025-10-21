import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail(formData: any) {
  console.log('AWS Config:', {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + '...',
    fromEmail: process.env.FROM_EMAIL
  });

  const emailContent = `
NEW BOOKING SUBMISSION:

Learner: ${formData.learnerFirstName} ${formData.learnerLastName}
Parent: ${formData.parentName}
Year Group: ${formData.yeargroup}
School: ${formData.school || 'Not specified'}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}

Class: ${formData.classPreference}
Target Grade: ${formData.targetGrade}
Exam Board: ${formData.examBoard}
Homework: ${formData.homework}
Travel: ${formData.travelArrangement}
Booking: ${formData.bookingOption}
Payment: ${formData.paymentPreference}
Communication: ${formData.communicationMethod}

Goals: ${formData.goals || 'Not specified'}
Maths Set: ${formData.mathsSet || 'Not specified'}
Notes: ${formData.notes || 'None'}
  `;

  const command = new SendEmailCommand({
    Source: process.env.FROM_EMAIL!,
    Destination: {
      ToAddresses: ['admin@mathstutorhelp.com'],
    },
    Message: {
      Subject: {
        Data: `New Booking: ${formData.learnerFirstName} ${formData.learnerLastName}`,
      },
      Body: {
        Text: {
          Data: emailContent,
        },
      },
    },
  });

  console.log('Sending email with SES...');
  const result = await sesClient.send(command);
  console.log('Email sent successfully:', result.MessageId);
  return result;
}