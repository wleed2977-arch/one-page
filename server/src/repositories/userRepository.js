import prisma from '../config/database.js';

export const findByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
};

export const findAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      profile: { select: { username: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'my-page';

export const createWithProfileAndPage = async (userData, profileData) => {
  const baseSlug = slugify(profileData.username);
  const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

  return await prisma.user.create({
    data: {
      ...userData,
      profile: { create: profileData },
      pages: {
        create: {
          title: 'My Page',
          slug,
          themeName: 'light',
        },
      },
    },
    include: {
      profile: true,
      pages: true,
    },
  });
};
