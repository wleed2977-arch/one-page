import * as pageRepository from '../repositories/pageRepository.js';
import * as messageRepository from '../repositories/messageRepository.js';
import { sendContactEmail } from '../config/mail.js';

const getRecipientEmail = (page) => {
  const contactWidget = page.widgets?.find(
    (w) => w.type === 'contact' && w.visible !== false
  );
  const widgetEmail = contactWidget?.data?.email;
  if (widgetEmail && typeof widgetEmail === 'string') {
    return widgetEmail.trim();
  }
  return page.user?.email || null;
};

export const submitContactMessage = async (slug, { name, email, message }) => {
  const page = await pageRepository.findBySlug(slug);
  if (!page) {
    throw { statusCode: 404, message: 'Page not found' };
  }

  const toEmail = getRecipientEmail(page);
  if (!toEmail) {
    throw { statusCode: 400, message: 'Contact email is not configured for this page' };
  }

  await messageRepository.create({
    userId: page.userId,
    name: name.trim(),
    email: email.trim(),
    content: message.trim(),
  });

  const emailResult = await sendContactEmail({
    to: toEmail,
    replyTo: email.trim(),
    fromName: name.trim(),
    message: message.trim(),
    pageSlug: slug,
    pageTitle: page.title,
  });

  return {
    emailDelivered: Boolean(emailResult.sent),
    emailSimulated: Boolean(emailResult.simulated),
  };
};
