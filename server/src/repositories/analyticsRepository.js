import prisma from '../config/database.js';

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const recordView = async (slug) => {
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) {
    throw { statusCode: 404, message: 'Page not found' };
  }

  const today = startOfDay(new Date());
  const existing = await prisma.analyticsRecord.findFirst({
    where: {
      pageId: page.id,
      date: { gte: today },
    },
  });

  if (existing) {
    return await prisma.analyticsRecord.update({
      where: { id: existing.id },
      data: { views: { increment: 1 } },
    });
  }

  return await prisma.analyticsRecord.create({
    data: { pageId: page.id, views: 1, date: today },
  });
};

export const getMyAnalytics = async (userId) => {
  const page = await prisma.page.findFirst({ where: { userId } });
  if (!page) {
    return { totalViews: 0, daily: [], widgetCount: 0 };
  }

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const records = await prisma.analyticsRecord.findMany({
    where: { pageId: page.id, date: { gte: since } },
    orderBy: { date: 'asc' },
  });

  const widgetCount = await prisma.widget.count({ where: { pageId: page.id } });
  const totalViews = records.reduce((sum, r) => sum + r.views, 0);

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const record = records.find(
      (r) => startOfDay(r.date).getTime() === d.getTime()
    );
    days.push({ label, views: record?.views || 0 });
  }

  return { totalViews, daily: days, widgetCount };
};
