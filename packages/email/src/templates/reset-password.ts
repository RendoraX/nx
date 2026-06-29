import { email } from "zod"
import sender from "../config/service"


export const resetPasswordEmail  = async (URL : string , name : string , email : string) => {
    try {
        await sender.sendMail({
            html : `
<body style="
    margin:0;
    background:#061412;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    color:#fff;
">

<div style="
    padding:70px 20px;
    background:
      radial-gradient(circle at center,
      rgba(19,160,113,.18) 0%,
      rgba(42,119,255,.10) 35%,
      rgba(6,20,18,0) 70%);
">

    <table
        width="620"
        cellpadding="0"
        cellspacing="0"
        align="center"
        style="
            background:rgba(8,22,20,.78);
            border:1px solid rgba(255,255,255,.08);
            border-radius:24px;
            overflow:hidden;
        "
    >

        <!-- Header -->
        <tr>
            <td style="
                padding:35px 40px;
                border-bottom:1px solid rgba(255,255,255,.08);
            ">

                <div style="
                    font-size:34px;
                    font-weight:800;
                    background:
                        linear-gradient(
                        90deg,
                        #25d88a,
                        #4ab8ff,
                        #25d88a
                    );
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                ">
                    Shri Vishwanath Ayurved
                </div>

                <div style="
                    color:#8fa8a1;
                    margin-top:8px;
                    font-size:13px;
                    letter-spacing:.5px;
                ">
                    Pure Herbs • Sacred Traditions
                </div>

            </td>
        </tr>

        <!-- Body -->
        <tr>
            <td style="padding:45px 40px;">

                <h1 style="
                    margin:0;
                    font-size:38px;
                    font-weight:700;
                    color:#fff;
                ">
                    Reset your password
                </h1>

                <p style="
                    color:#b3c0bc;
                    margin-top:25px;
                    font-size:18px;
                    line-height:32px;
                ">
                    Hi ${name},
                    <br><br>
                    We received a request to reset the password for your account.
                    Click the button below to create a new password.
                </p>

                <!-- Button -->
                <div style="
                    text-align:center;
                    margin:45px 0;
                ">
                    <a
                        href="${URL}"
                        style="
                            display:inline-block;
                            padding:18px 42px;
                            border-radius:16px;
                            background:
                                linear-gradient(
                                135deg,
                                #1ac07c,
                                #2c9dff
                            );
                            color:#ffffff;
                            text-decoration:none;
                            font-size:17px;
                            font-weight:700;
                            box-shadow:
                                0 10px 30px rgba(26,192,124,.18);
                        "
                    >
                        Reset Password
                    </a>
                </div>

                <p style="
                    color:#8fa8a1;
                    font-size:15px;
                    line-height:28px;
                    margin-bottom:0;
                ">
                    This link will expire in <strong style="color:#fff;">30 minutes</strong>.
                    If you didn't request a password reset, you can safely ignore this email.
                </p>

                <!-- Fallback URL -->
                <div style="
                    margin-top:35px;
                    padding:18px;
                    border-radius:16px;
                    background:rgba(255,255,255,.03);
                    border:1px solid rgba(255,255,255,.08);
                ">
                    <div style="
                        color:#7f9690;
                        font-size:12px;
                        margin-bottom:8px;
                    ">
                        If the button doesn't work, copy and paste this link:
                    </div>

                    <div style="
                        color:#b5c8c2;
                        word-break:break-all;
                        font-size:13px;
                        line-height:24px;
                    ">
                        {{RESET_URL}}
                    </div>
                </div>

            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="
                border-top:1px solid rgba(255,255,255,.08);
                padding:24px 40px;
            ">

                <table width="100%">
                    <tr>

                        <td style="
                            color:#7f9690;
                            font-size:14px;
                        ">
                            © 2026 Shri Ayu
                        </td>

                        <td align="right">

                            <a
                                href="{{FACEBOOK_URL}}"
                                style="
                                    color:#9ab7b0;
                                    text-decoration:none;
                                    margin-right:20px;
                                    font-size:14px;
                                "
                            >
                                Facebook
                            </a>

                            <a
                                href="{{INDIAMART_URL}}"
                                style="
                                    color:#9ab7b0;
                                    text-decoration:none;
                                    font-size:14px;
                                "
                            >
                                IndiaMART
                            </a>

                        </td>

                    </tr>
                </table>

            </td>
        </tr>

    </table>

</div>

</body>

            `,
            to : email,
            subject : "Password Recover"
        })
    } catch (error) {
        throw new Error("Mail INIT Error")
    }
}