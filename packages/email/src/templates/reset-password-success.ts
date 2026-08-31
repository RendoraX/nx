import sender from "../config/service";

export const resetPasswordSuccessEmail = async (
  name: string,
  email: string
) => {
  try {
    console.log(
      "Sending password success email to:",
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

        subject: "Password Changed Successfully",

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
                  color:#ffffff;
                  padding:40px;
                  border-radius:16px;
                "
              >

                <tr>
                  <td>

                    <h1 style="
                      color:#25d88a;
                    ">
                      Shri Vishwanath Ayurved
                    </h1>

                    <h2>
                      Password Changed Successfully
                    </h2>

                    <p style="
                      color:#b3c0bc;
                      line-height:1.6;
                    ">
                      Hello ${name},
                    </p>

                    <p style="
                      color:#b3c0bc;
                      line-height:1.6;
                    ">
                      Your account password has been changed successfully.
                    </p>

                    <p style="
                      color:#b3c0bc;
                      line-height:1.6;
                    ">
                      If you did not make this change,
                      please contact support immediately.
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
      "Password success email sent:",
      result
    );

    return result;

  } catch (error: any) {
    console.error(
      "PASSWORD SUCCESS EMAIL ERROR:",
      error
    );

    throw new Error(
      error?.message ||
      "Failed to send password success email"
    );
  }
};