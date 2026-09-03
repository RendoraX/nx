import sender from "../config/service";

export const verifyEmail = async (
  otp: string,
  email: string
) => {
  try {
    console.log("Sending verification email to:", email);

    const result =
      await sender.transactionalEmails.sendTransacEmail({
        sender: {
          name: "Shri Vishwanath Ayurved",
          email: "swapnilnade07@gmail.com",
        },

        to: [
          {
            email,
          },
        ],

        subject: "Account Verification",

        htmlContent: `
          <!DOCTYPE html>
          <html>
          <body style="
            margin:0;
            padding:0;
            background:#061412;
            font-family:Arial,sans-serif;
          ">

            <div style="
              padding:50px 20px;
            ">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width:600px;
                  margin:auto;
                  background:#081614;
                  border-radius:16px;
                  padding:40px;
                  color:#ffffff;
                "
              >

                <tr>
                  <td>

                    <h1 style="
                      color:#25d88a;
                      margin-top:0;
                    ">
                      Shri Vishwanath Ayurved
                    </h1>

                    <h2>
                      Verify your email
                    </h2>

                    <p style="
                      color:#b3c0bc;
                      font-size:16px;
                      line-height:1.6;
                    ">
                      Use the verification code below to verify your account.
                    </p>

                    <div style="
                      margin:30px 0;
                      padding:20px;
                      text-align:center;
                      background:#102824;
                      border-radius:12px;
                    ">

                      <span style="
                        font-size:38px;
                        font-weight:bold;
                        letter-spacing:8px;
                      ">
                        ${otp}
                      </span>

                    </div>

                    <p style="
                      color:#8fa8a1;
                    ">
                      This verification code will expire in 10 minutes.
                    </p>

                  </td>
                </tr>

              </table>

            </div>

          </body>
          </html>
        `,
      });

    console.log(
      "Verification email sent:",
      result
    );

    return result;

  } catch (error: any) {
    console.error(
      "VERIFY EMAIL ERROR:",
      error
    );

    throw new Error(
      error?.message ||
      "Failed to send verification email"
    );
  }
};