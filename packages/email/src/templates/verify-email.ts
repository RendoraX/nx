import sender from "../config/service"


export const veirfyEmail = async (otp : string , email : string) => {
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
            background:rgba(8,22,20,.75);
            border:1px solid rgba(255,255,255,.08);
            border-radius:24px;
            overflow:hidden;
            backdrop-filter:blur(25px);
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
                    Verify your email
                </h1>

                <p style="
                    color:#b3c0bc;
                    margin-top:25px;
                    font-size:18px;
                    line-height:32px;
                ">
                    Hi User,
                    <br><br>
                    Use the verification code below to securely access your account.
                </p>

                <!-- OTP -->
                <div style="
                    margin:40px 0;
                    padding:24px;
                    text-align:center;
                    border-radius:20px;
                    border:1px solid rgba(255,255,255,.08);
                    background:
                        linear-gradient(
                        135deg,
                        rgba(25,165,110,.10),
                        rgba(40,130,255,.10)
                    );
                ">
                    <span style="
                        font-size:42px;
                        font-weight:800;
                        letter-spacing:10px;
                        color:#fff;
                    ">
                        ${otp}
                    </span>
                </div>

                <p style="
                    color:#8fa8a1;
                    font-size:15px;
                    line-height:28px;
                ">
                    This code will expire in 10 minutes.
                    If you didn't request this email, you can safely ignore it.
                </p>

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
            subject : "Account Verification"
        })
    } catch (error) {
        throw new Error("Mail INIT Error")
    }
}