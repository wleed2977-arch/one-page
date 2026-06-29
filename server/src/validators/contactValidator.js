import { z } from 'zod';

export const contactMessageSchema = z.object({
  params: z.object({
    slug: z.string().min(1).max(80),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').max(120),
    email: z.string().email('Valid email is required'),
    message: z.string().min(1, 'Message is required').max(5000),
  }),
});
