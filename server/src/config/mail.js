import nodemailer from 'nodemailer';
import { ENV } from './env.js';

let transporter = null;

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const hasSmtp = () =>
  Boolean(ENV.SMTP_HOST && ENV.SMTP_USER && ENV.SMTP_PASS);

export const getTransporter = () => {
  if (!hasSmtp()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: Number(ENV.SMTP_PORT) || 587,
      secure: ENV.SMTP_SECURE === 'true',
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export const sendContactEmail = async ({
  to,
  replyTo,
  fromName,
  message,
  pageSlug,
  pageTitle,
}) => {
  const transport = getTransporter();
  const fromAddress = ENV.SMTP_FROM || ENV.SMTP_USER;
  const subject = `New message from ${fromName} — ${pageTitle || pageSlug}`;
  const text = [
    `You received a new message on your OnePage (${pageSlug}).`,
    '',
    `From: ${fromName} <${replyTo}>`,
    '',
    message,
  ].join('\n');

  const mailOptions = {
    from: `"OnePage" <${fromAddress}>`,
    to,
    replyTo,
    subject,
    text,
    html: `
      <p>You received a new message on your OnePage (<strong>${pageSlug}</strong>).</p>
      <p><strong>From:</strong> ${fromName} &lt;${replyTo}&gt;</p>
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `,
  };

  if (!transport) {
    if (ENV.NODE_ENV === 'development') {
      console.log('[Contact] SMTP not configured — email logged only:\n', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
      });
      return { simulated: true };
    }
    return { skipped: true };
  }

  await transport.sendMail(mailOptions);
  return { sent: true };
};
