import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../../email-service";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Form submission:", data);

    // Send email
    await sendEmail(data);

    return NextResponse.json({
      success: true,
      message: "Form submitted and email sent successfully",
    });
  } catch (error: any) {
    console.error("Form submission error:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      {
        success: false,
        errorMessage: `Failed to submit form: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
