import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().max(100).optional(),
    username: z.string().min(3).max(50).optional(),
    jobTitle: z.string().max(100).optional(),
    bio: z.string().max(2000).optional(),
    avatar: z.string().optional(),
    resume: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().max(30).optional(),
    location: z.string().max(100).optional(),
    website: z.string().optional(),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  }),
});
