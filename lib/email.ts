import nodemailer from 'nodemailer';

// Create transporter - you'll need to configure with your email service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: parseInt(process.env.SMTP_PORT || '587') === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates (for some hosting providers)
  },
  // Additional settings to improve deliverability
  pool: true,
  maxConnections: 1,
  rateDelta: 1000,
  rateLimit: 5,
});

export async function sendVerificationEmail(email: string, otp: string, username: string) {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Aging Care'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
    },
    html: `
     <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <title>Email Verification</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 10px !important;
              }
              .content-padding {
                padding: 30px 20px !important;
              }
              .otp-code {
                font-size: 36px !important;
                letter-spacing: 6px !important;
              }
              .logo {
                max-width: 180px !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 10px;">
            <tr>
              <td align="center">
                <table class="container px-2" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 600px; border: #333333;">
                  
                  <!-- Logo Header -->
                  <tr class="border-b-1 border-gray-300 px-2">
                    <td style="background: #ffffff; padding: 30px; text-align: center;">
                      <img src="https://www.mynestshield.com/_next/image?url=%2Fimages%2FMyNestShield.png&w=1920&q=75" alt="MyNestShield" class="logo" style="max-width: 200px; height: auto; display: inline-block; margin-bottom: 15px;" />
                      <h1 style="color: #69b043; margin: 0; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td class="content-padding" style="padding: 40px 30px;">
                      <p style="font-size: 16px; margin: 0 0 20px 0; color: #000; text-align: center;">Hello <strong style="color: #69b043;">${username}</strong>,</p>
                      
                      <p style="font-size: 16px; margin: 0 0 30px 0; color: #000; text-align: center;">Thank you for registering with <strong style="color: #69b043;">MyNestShield</strong>. To complete your registration, please verify your email address using the code below:</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="text-align: center; padding: 20px 10px;">
                            <div style="background: #fff; border: 2px dashed #69b043; border-radius: 12px; padding: 30px 20px; display: inline-block; max-width: 100%;">
                              <p style="font-size: 14px; color: #6B7280; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                              <p class="otp-code" style="font-size: 42px; color: #000000; letter-spacing: 10px; margin: 0; font-weight: bold; font-family: 'Courier New', monospace;">${otp}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0;">
                        <tr>
                          <td style="background: #69b043; border-left: 4px solid #69b043; border-radius: 6px; padding: 15px;">
                            <p style="font-size: 14px; color: #ffffff; margin: 0;">
                             This verification code will expire in <strong>10 minutes</strong>. Please enter it promptly to verify your email address.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="font-size: 14px; color: #6B7280; margin: 20px 0 0 0;">
                        If you didn't create an account with MyNestShield, please disregard this email. Your email address will not be used without verification.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); padding: 30px 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                      <p style="font-size: 12px; color: #6B7280; margin: 0 0 10px 0;">
                        This is an automated message from <strong style="color: #69b043;">MyNestShield</strong>. Please do not reply to this email.
                      </p>
                      <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
                        © ${new Date().getFullYear()} MyNestShield. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Hello ${username},

Thank you for registering with MyNestShield!

Your verification code is: ${otp}

This code will expire in 10 minutes. Please enter it on the verification page to complete your registration.

If you didn't create an account with MyNestShield, please ignore this email and close.

---
This is an automated message from MyNestShield. Please do not reply to this email.
© ${new Date().getFullYear()} MyNestShield. All rights reserved.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get OTP expiry time (10 minutes from now)
export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
