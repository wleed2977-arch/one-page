import prisma from '../config/database.js';

export const findAll = async () => {
  return await prisma.page.findMany({ include: { widgets: true } });
};

export const findByUserId = async (userId) => {
  return await prisma.page.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { widgets: { orderBy: { order: 'asc' } } },
  });
};

export const findBySlug = async (slug) => {
  return await prisma.page.findUnique({
    where: { slug },
    include: {
      widgets: { orderBy: { order: 'asc' } },
      user: { select: { id: true, email: true } },
    },
  });
};

export const updatePage = async (pageId, data) => {
  return await prisma.page.update({
    where: { id: pageId },
    data,
    include: { widgets: { orderBy: { order: 'asc' } } },
  });
};

export const saveWidgets = async (pageId, widgets) => {
  return await prisma.$transaction(async (tx) => {
    await tx.widget.deleteMany({ where: { pageId } });

    if (widgets.length > 0) {
      await tx.widget.createMany({
        data: widgets.map((w, index) => ({
          type: w.type,
          order: w.order ?? index,
          visible: w.visible ?? true,
          data: w.data || {},
          pageId,
        })),
      });
    }

    return await tx.page.findUnique({
      where: { id: pageId },
      include: { widgets: { orderBy: { order: 'asc' } } },
    });
  });
};
