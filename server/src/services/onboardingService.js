import prisma from '../config/database.js';
import * as pageRepository from '../repositories/pageRepository.js';
import { buildStarterWidgets } from '../data/starterTemplate.js';

export const getStatus = async (userId) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    throw { statusCode: 404, message: 'Profile not found' };
  }

  const page = await pageRepository.findByUserId(userId);

  return {
    completed: profile.onboardingCompleted,
    profile,
    page,
  };
};

export const complete = async (userId, { fullName, jobTitle, slug, theme }) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    throw { statusCode: 404, message: 'Profile not found' };
  }

  if (profile.onboardingCompleted) {
    throw { statusCode: 400, message: 'Onboarding already completed' };
  }

  const page = await pageRepository.findByUserId(userId);
  if (!page) {
    throw { statusCode: 404, message: 'Page not found' };
  }

  const existingSlug = await prisma.page.findUnique({ where: { slug } });
  if (existingSlug && existingSlug.id !== page.id) {
    throw { statusCode: 409, message: 'This URL slug is already taken' };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  await prisma.profile.update({
    where: { userId },
    data: {
      fullName,
      jobTitle,
      bio: `Hi, I'm ${fullName}. I'm a ${jobTitle}.`,
      onboardingCompleted: true,
    },
  });

  await pageRepository.updatePage(page.id, {
    slug,
    themeName: theme,
    title: `${fullName}'s Page`,
  });

  const widgets = buildStarterWidgets({
    fullName,
    jobTitle,
    email: user?.email || profile.email,
  });

  const updatedPage = await pageRepository.saveWidgets(page.id, widgets);

  const updatedProfile = await prisma.profile.findUnique({ where: { userId } });

  return { profile: updatedProfile, page: updatedPage };
};
