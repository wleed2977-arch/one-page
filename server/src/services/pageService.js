import * as pageRepository from '../repositories/pageRepository.js';

export const getAllPages = async () => {
  return await pageRepository.findAll();
};

export const getMyPage = async (userId) => {
  const page = await pageRepository.findByUserId(userId);
  if (!page) {
    throw { statusCode: 404, message: 'Page not found' };
  }
  return page;
};

export const getPageBySlug = async (slug) => {
  const page = await pageRepository.findBySlug(slug);
  if (!page) {
    throw { statusCode: 404, message: 'Page not found' };
  }
  return page;
};

export const updateMyPage = async (userId, data) => {
  const page = await pageRepository.findByUserId(userId);
  if (!page) {
    throw { statusCode: 404, message: 'Page not found' };
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.themeName !== undefined) updateData.themeName = data.themeName;
  if (data.theme !== undefined) updateData.themeName = data.theme;
  if (data.description !== undefined) updateData.description = data.description;

  return await pageRepository.updatePage(page.id, updateData);
};

export const saveMyWidgets = async (userId, widgets) => {
  const page = await pageRepository.findByUserId(userId);
  if (!page) {
    throw { statusCode: 404, message: 'Page not found' };
  }
  return await pageRepository.saveWidgets(page.id, widgets);
};
