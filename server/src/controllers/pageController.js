import * as pageService from '../services/pageService.js';
import { sendResponse } from '../utils/response.js';

export const getPages = async (req, res, next) => {
  try {
    const pages = await pageService.getAllPages();
    sendResponse(res, 200, true, 'Pages fetched successfully', { pages });
  } catch (error) {
    next(error);
  }
};

export const getMyPage = async (req, res, next) => {
  try {
    const page = await pageService.getMyPage(req.user.id);
    sendResponse(res, 200, true, 'Page fetched successfully', { page });
  } catch (error) {
    next(error);
  }
};

export const updateMyPage = async (req, res, next) => {
  try {
    const page = await pageService.updateMyPage(req.user.id, req.body);
    sendResponse(res, 200, true, 'Page updated successfully', { page });
  } catch (error) {
    next(error);
  }
};

export const saveMyWidgets = async (req, res, next) => {
  try {
    const page = await pageService.saveMyWidgets(req.user.id, req.body.widgets);
    sendResponse(res, 200, true, 'Widgets saved successfully', { page });
  } catch (error) {
    next(error);
  }
};

export const getPageBySlug = async (req, res, next) => {
  try {
    const page = await pageService.getPageBySlug(req.params.slug);
    sendResponse(res, 200, true, 'Page fetched successfully', { page });
  } catch (error) {
    next(error);
  }
};
