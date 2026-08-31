import resend from "../config/resend_server";
import sender from "../config/service";

export const resetPasswordEmail = async (
  URL: string,
  name: string,
  email: string
) => {
  // Brand Configuration Links
  const facebookUrl = "https://facebook.com"; // Replace with your official Facebook link
  const indiamartUrl = "https://indiamart.com"; // Replace with your official IndiaMART link

  try {
    await resend.emails.send({
                  from: "Shri Vishwanath Ayurved <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset - Action Required",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="
    margin:0;
    padding:0;
    background-color:#0D110F;
    font-family:-apple-system, BlinkMacSystemFont, 'Georgia', 'Segoe UI', serif;
    color:#2B2B2B;
    -webkit-font-smoothing:antialiased;
">

<div style="
    padding:50px 15px;
    background:#0D110F;
">

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        align="center"
        style="
            max-width:600px;
            margin:0 auto;
            background:#FCFAF7;
            border:1px solid #EAE3D2;
            border-radius:4px;
            overflow:hidden;
            box-shadow:0 20px 40px rgba(0,0,0,0.3);
        "
    >

        <!-- Accent Top Bar -->
        <tr>
            <td style="background:#1F5E3B; height:6px;"></td>
        </tr>

        <!-- Header -->
        <tr>
            <td style="
                padding:40px 40px 30px 40px;
                text-align:center;
                border-bottom:1px solid #EAE3D2;
            ">
                <div style="
                    font-family:'Georgia', serif;
                    font-size:28px;
                    font-weight:600;
                    color:#1F5E3B;
                    letter-spacing:0.5px;
                ">
                    Shri Vishwanath Ayurved
                </div>

                <div style="
                    color:#C89B3C;
                    margin-top:6px;
                    font-size:11px;
                    font-family:'Courier New', monospace, sans-serif;
                    letter-spacing:3px;
                    text-transform:uppercase;
                    font-weight:600;
                ">
                    Pure Herbs • Sacred Traditions
                </div>
            </td>
        </tr>

        <!-- Main Content -->
        <tr>
            <td style="padding:40px 40px;">

                <h1 style="
                    margin:0;
                    font-family:'Georgia', serif;
                    font-size:26px;
                    font-weight:400;
                    color:#111111;
                    letter-spacing:-0.5px;
                ">
                    Reset Your Password
                </h1>

                <p style="
                    color:#555555;
                    margin-top:20px;
                    font-size:15px;
                    line-height:26px;
                ">
                    Hello <strong style="color:#111111;">${name}</strong>,
                    <br><br>
                    We received a request to access your Shri Vishwanath Ayurved account. To set a new password, click the button below.
                </p>

                <!-- Action Button -->
                <div style="
                    text-align:center;
                    margin:35px 0;
                ">
                    <a
                        href="${URL}"
                        target="_blank"
                        style="
                            display:inline-block;
                            padding:16px 36px;
                            border-radius:0px;
                            background:#1F5E3B;
                            border:1px solid #1F5E3B;
                            color:#FFFFFF;
                            text-decoration:none;
                            font-size:12px;
                            font-family:'Courier New', monospace, sans-serif;
                            font-weight:700;
                            letter-spacing:2px;
                            text-transform:uppercase;
                        "
                    >
                        Reset Password
                    </a>
                </div>

                <p style="
                    color:#7C7467;
                    font-size:13px;
                    line-height:22px;
                    margin-bottom:0;
                ">
                    This single-use link will expire in <strong style="color:#1F5E3B;">30 minutes</strong>. If you did not initiate this request, you can safely ignore this email.
                </p>

                <!-- Alternative Link Block -->
                <div style="
                    margin-top:30px;
                    padding:20px;
                    background:#F5F0E6;
                    border:1px solid #EAE3D2;
                ">
                    <div style="
                        color:#7C7467;
                        font-family:'Courier New', monospace, sans-serif;
                        font-size:10px;
                        letter-spacing:1px;
                        text-transform:uppercase;
                        margin-bottom:8px;
                    ">
                        Alternative Direct Link:
                    </div>

                    <div style="
                        color:#1F5E3B;
                        word-break:break-all;
                        font-size:12px;
                        line-height:18px;
                    ">
                        <a href="${URL}" style="color:#1F5E3B; text-decoration:underline;">${URL}</a>
                    </div>
                </div>

            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="
                border-top:1px solid #EAE3D2;
                background:#F9F6F0;
                padding:25px 40px;
            ">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="
                            color:#7C7467;
                            font-size:12px;
                            font-family:'Georgia', serif;
                        ">
                            © 2026 Shri Ayu
                        </td>

                        <td align="right">
                            <a
                                href="${facebookUrl}"
                                target="_blank"
                                style="
                                    color:#1F5E3B;
                                    text-decoration:none;
                                    margin-right:15px;
                                    font-size:12px;
                                    font-weight:600;
                                "
                            >
                                Facebook
                            </a>

                            <a
                                href="${indiamartUrl}"
                                target="_blank"
                                style="
                                    color:#1F5E3B;
                                    text-decoration:none;
                                    font-size:12px;
                                    font-weight:600;
                                "
                            >
                                IndiaMART dmeo
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

    </table>

</div>

</body>
</html>
            `,
    });
  } catch (error) {
    throw new Error("Mail INIT Error");
  }
};