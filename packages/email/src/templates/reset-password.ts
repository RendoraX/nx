import sender from "../config/service";

export const resetPasswordEmail = async (
  URL: string,
  name: string,
  email: string
) => {
  try {
    console.log(
      "Sending password reset email to:",
      email
    );

    const result =
      await sender.transactionalEmails.sendTransacEmail({
        sender: {
          name: "Shri Vishwanath Ayurved",
          email: "shrivishwanathayurved708@gmail.com",
        },

        to: [
          {
            email,
          },
        ],

        subject: "Password Reset - Action Required",

        htmlContent: `
          <!DOCTYPE html>
          <html>
          <body style="
            margin:0;
            padding:0;
            background:#0D110F;
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
                  background:#FCFAF7;
                  padding:40px;
                  border-radius:12px;
                "
              >

                <tr>
                  <td>

                    <h1 style="
                      color:#1F5E3B;
                    ">
                      Shri Vishwanath Ayurved
                    </h1>

                    <h2>
                      Reset Your Password
                    </h2>

                    <p style="
                      color:#555;
                      line-height:1.6;
                    ">
                      Hello ${name},
                    </p>

                    <p style="
                      color:#555;
                      line-height:1.6;
                    ">
                      We received a request to reset your password.
                      Click the button below to create a new password.
                    </p>

                    <div style="
                      text-align:center;
                      margin:35px 0;
                    ">

                      <a
                        href="${URL}"
                        style="
                          display:inline-block;
                          background:#1F5E3B;
                          color:#ffffff;
                          padding:15px 30px;
                          text-decoration:none;
                          font-weight:bold;
                        "
                      >
                        Reset Password
                      </a>

                    </div>

                    <p style="
                      color:#777;
                    ">
                      This link will expire in 30 minutes.
                    </p>

                    <p style="
                      color:#777;
                      word-break:break-all;
                    ">
                      If the button does not work, use this link:
                      <br />
                      ${URL}
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
      "Password reset email sent:",
      result
    );

    return result;

  } catch (error: any) {
    console.error(
      "RESET PASSWORD EMAIL ERROR:",
      error
    );

    throw new Error(
      error?.message ||
      "Failed to send reset password email"
    );
  }
};