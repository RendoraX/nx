import resend from "../config/resend_server";
import sender from "../config/service";

export const veirfyEmail = async (
  otp: string,
  email: string
) => {
  try {
    console.log("Attempting to send email to:", email);

    const result = await sender.sendMail({
      from: "Shri Vishwanath Ayurved <noreply@shrivishwanathayurved.in>",
      to: [email],
      subject: "Account Verification",
      html: `<h1>Your OTP is: ${otp}</h1>`,
    });



  } catch (error) {
    console.error(
      "EMAIL SEND FAILED:",
      error
    );

    throw error;
  }
};