import prisma from '../config/database.js';

export const create = async ({ userId, name, email, content }) => {
  return prisma.message.create({
    data: { userId, name, email, content },
  });
};
