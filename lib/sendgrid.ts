import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailParams {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
}: SendEmailParams) {
  try {
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error: any) {
    console.error("SendGrid error:", error);
    if (error.response) {
      console.error("SendGrid response body:", error.response.body);
    }
    return { success: false, error: error.message };
  }
}

export async function sendContactFormEmail({
  firstName,
  lastName,
  email,
  subject,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const emailContent = {
    to: process.env.EMAIL_TO || "info@make-ready-consulting.com",
    from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
    subject: `Website Contact Form: ${subject}`,
    text: `
New Contact Form Submission

From: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6B46C1;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3 style="color: #6B46C1;">Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          This email was sent from the Make Ready Consulting website contact form.
        </p>
      </div>
    `,
  };

  return await sendEmail(emailContent);
}

