import { z } from 'zod';

export const createPageSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  }),
});

export const updatePageSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
    theme: z.enum(['light', 'dark', 'linear', 'glass', 'forest', 'ocean']).optional(),
    themeName: z.enum(['light', 'dark', 'linear', 'glass', 'forest', 'ocean']).optional(),
    description: z.string().max(500).optional(),
  }),
});

export const saveWidgetsSchema = z.object({
  body: z.object({
    widgets: z.array(
      z.object({
        type: z.string().min(1),
        order: z.number().int().min(0).optional(),
        visible: z.boolean().optional(),
        data: z.record(z.unknown()).optional(),
      })
    ),
  }),
});
