import { sendEmail } from "./sendgrid";

// Generate random 6-digit code
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send 2FA code via email
export async function sendTwoFactorEmail({
  email,
  name,
  code,
}: {
  email: string;
  name: string;
  code: string;
}) {
  const emailContent = {
    to: email,
    from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
    subject: "Your Make Ready Login Verification Code",
    text: `
Hello ${name},

Your verification code is: ${code}

This code will expire in 10 minutes.

If you did not request this code, please ignore this email or contact us immediately at info@make-ready-consulting.com

Best regards,
Make Ready Security Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2F2F72; margin: 0; font-weight: 600;">MAKE READY</h1>
          <p style="color: #666; margin: 5px 0;">Login Verification</p>
        </div>
        
        <h2 style="color: #2F2F72;">Verification Code</h2>
        
        <p>Hello ${name},</p>
        
        <p>Your verification code for logging into Make Ready is:</p>
        
        <div style="background: linear-gradient(-138deg, #D4AF37 0%, #F4D479 50%, #D4AF37 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <h1 style="margin: 0; font-size: 48px; color: #2F2F72 !important; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${code}
          </h1>
        </div>
        
        <div style="background-color: #FFF9E0; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>⏱ This code will expire in 10 minutes.</strong>
          </p>
        </div>
        
        <p style="color: #666;">If you did not request this code, please ignore this email or contact us immediately.</p>
        
        <div style="background-color: #F5F5FF; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #2F2F72; margin-top: 0;">Security Tips</h3>
          <ul style="color: #666; margin: 0; padding-left: 20px;">
            <li>Never share your verification code with anyone</li>
            <li>Make Ready staff will never ask for your code</li>
            <li>This code is only valid for 10 minutes</li>
          </ul>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          This is an automated security email from Make Ready Consulting.<br>
          If you have concerns, contact us at info@make-ready-consulting.com<br>
          <br>
          <strong>Do not reply to this email.</strong>
        </p>
      </div>
    `,
  };

  return await sendEmail(emailContent);
}

// Store 2FA code temporarily (in production, use Redis or database)
const twoFactorCodes = new Map<string, { code: string; expiresAt: number }>();

export function storeTwoFactorCode(email: string, code: string) {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  twoFactorCodes.set(email, { code, expiresAt });
  
  // Clean up expired codes
  setTimeout(() => {
    twoFactorCodes.delete(email);
  }, 10 * 60 * 1000);
}

export function verifyTwoFactorCode(email: string, code: string): boolean {
  const stored = twoFactorCodes.get(email);
  
  if (!stored) {
    return false;
  }
  
  if (Date.now() > stored.expiresAt) {
    twoFactorCodes.delete(email);
    return false;
  }
  
  if (stored.code === code) {
    twoFactorCodes.delete(email);
    return true;
  }
  
  return false;
}

