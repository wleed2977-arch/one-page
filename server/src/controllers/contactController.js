import * as contactService from '../services/contactService.js';
import { sendResponse } from '../utils/response.js';

export const submitMessage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, email, message } = req.body;

    const result = await contactService.submitContactMessage(slug, {
      name,
      email,
      message,
    });

    let responseMessage = 'Message sent successfully';
    if (result.emailSimulated) {
      responseMessage = 'Message received (email logged in dev — configure SMTP to deliver)';
    } else if (!result.emailDelivered) {
      responseMessage = 'Message saved successfully';
    }

    sendResponse(res, 200, true, responseMessage, result);
  } catch (error) {
    next(error);
  }
};
