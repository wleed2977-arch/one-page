import prisma from '../config/database.js';

export const findByUserId = async (userId) => {
  return await prisma.profile.findUnique({ where: { userId } });
};

export const updateByUserId = async (userId, data) => {
  return await prisma.profile.update({
    where: { userId },
    data,
  });
};
