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
  ticketNumber,
}: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  ticketNumber?: string;
}) {
  const emailContent = {
    to: process.env.EMAIL_TO || "info@make-ready-consulting.com",
    from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
    subject: ticketNumber
      ? `[${ticketNumber}] Website Contact: ${subject}`
      : `Website Contact Form: ${subject}`,
    text: `
New Contact Form Submission
${ticketNumber ? `Ticket Number: ${ticketNumber}\n` : ""}
From: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6B46C1;">New Contact Form Submission</h2>
        ${
          ticketNumber
            ? `<div style="background-color: #F59E0B; color: white; padding: 10px 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <strong>Ticket #${ticketNumber}</strong>
              </div>`
            : ""
        }
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

export async function sendCustomerConfirmationEmail({
  firstName,
  lastName,
  email,
  subject,
  ticketNumber,
}: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  ticketNumber: string;
}) {
  const emailContent = {
    to: email,
    from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
    subject: `Thank you for contacting Make Ready Consulting - Ticket #${ticketNumber}`,
    text: `
Dear ${firstName} ${lastName},

Thank you for contacting Make Ready Consulting!

We have received your inquiry regarding "${subject}" and assigned it ticket number: ${ticketNumber}

Our team will review your message and respond within 24 business hours. Please reference this ticket number in any future correspondence regarding this inquiry.

If you have any urgent matters, please contact us directly at:
Email: info@make-ready-consulting.com
Phone: (703) 555-0100
Address: 9409 B Battle Street, Manassas, VA 20110

Best regards,
Make Ready Consulting Team

---
This is an automated confirmation email. Please do not reply directly to this message.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6B46C1; margin: 0;">MAKE READY</h1>
          <p style="color: #666; margin: 5px 0;">Strategic Solutions for Government Success</p>
        </div>
        
        <h2 style="color: #6B46C1;">Thank You for Contacting Us!</h2>
        
        <p>Dear ${firstName} ${lastName},</p>
        
        <p>Thank you for contacting Make Ready Consulting! We have received your inquiry and assigned it the following ticket number:</p>
        
        <div style="background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <h2 style="margin: 0; font-size: 32px; color: white;">Ticket #${ticketNumber}</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Please reference this number for future correspondence</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 0;"><strong>Status:</strong> <span style="color: #F59E0B;">Under Review</span></p>
        </div>
        
        <h3 style="color: #6B46C1;">What Happens Next?</h3>
        <ul style="line-height: 1.8;">
          <li>Our team will review your inquiry</li>
          <li>You'll receive a response within 24 business hours</li>
          <li>We'll keep you updated on the status of your request</li>
        </ul>
        
        <div style="background-color: #EDE9FE; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #6B46C1; margin-top: 0;">Need Immediate Assistance?</h3>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:info@make-ready-consulting.com" style="color: #6B46C1;">info@make-ready-consulting.com</a></p>
          <p style="margin: 10px 0;"><strong>Address:</strong> 9409 B Battle Street, Manassas, VA 20110</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          This is an automated confirmation email from Make Ready Consulting.<br>
          Please do not reply directly to this message.<br>
          <br>
          Proudly Veteran Owned and Operated
        </p>
      </div>
    `,
  };

  return await sendEmail(emailContent);
}

