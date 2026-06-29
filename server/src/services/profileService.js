import * as profileRepository from '../repositories/profileRepository.js';
import * as pageRepository from '../repositories/pageRepository.js';

export const getMyProfile = async (userId) => {
  const profile = await profileRepository.findByUserId(userId);
  if (!profile) {
    throw { statusCode: 404, message: 'Profile not found' };
  }
  const page = await pageRepository.findByUserId(userId);
  return { profile, page };
};

export const updateMyProfile = async (userId, data) => {
  const allowed = [
    'fullName', 'username', 'jobTitle', 'bio', 'avatar',
    'resume', 'email', 'phone', 'location', 'website',
  ];
  const updateData = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  const profile = await profileRepository.updateByUserId(userId, updateData);

  if (data.slug) {
    const page = await pageRepository.findByUserId(userId);
    if (page) {
      await pageRepository.updatePage(page.id, { slug: data.slug });
    }
  }

  return profile;
};
