import resend from "../config/resend_server";

export const veirfyEmail = async (
  otp: string,
  email: string
) => {
  try {
    console.log("Attempting to send email to:", email);

    const result = await resend.emails.send({
      from: "Shri Vishwanath Ayurved <onboarding@resend.dev>",
      to: [email],
      subject: "Account Verification",
      html: `<h1>Your OTP is: ${otp}</h1>`,
    });

    console.log(
      "RESEND FULL RESPONSE:",
      JSON.stringify(result, null, 2)
    );

    if (result.error) {
      console.error(
        "RESEND ERROR:",
        result.error
      );

      throw new Error(
        result.error.message || "Email sending failed"
      );
    }

    console.log(
      "EMAIL SENT SUCCESSFULLY:",
      result.data
    );

    return result.data;

  } catch (error) {
    console.error(
      "EMAIL SEND FAILED:",
      error
    );

    throw error;
  }
};