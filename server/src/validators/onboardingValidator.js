import { z } from 'zod';

export const completeOnboardingSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required').max(100),
    jobTitle: z.string().min(2, 'Job title is required').max(100),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    theme: z.enum(['light', 'dark', 'linear', 'glass', 'forest', 'ocean']),
  }),
});
