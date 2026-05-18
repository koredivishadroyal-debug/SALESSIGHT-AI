import nodemailer from 'nodemailer';

interface NotificationPayload {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    // Check if configuration exists
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.warn('SMTP configuration is missing. Emails will not be sent.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendNotification({ to, subject, text, html }: NotificationPayload) {
  const mailTransporter = getTransporter();
  
  if (!mailTransporter) {
    console.log('Skipping email send (missing configuration)');
    return;
  }

  const info = await mailTransporter.sendMail({
    from: process.env.SMTP_FROM || '"SalesSight AI" <notifications@salessight.ai>',
    to: to || process.env.ADMIN_EMAIL,
    subject,
    text,
    html: html || text,
  });

  console.log('Message sent: %s', info.messageId);
  return info;
}
