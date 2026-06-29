import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';
import { signToken } from '../config/jwt.js';

export const registerUser = async (email, password) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw { statusCode: 409, message: 'Email is already registered' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = email.split('@')[0] + '-' + Math.floor(Math.random() * 1000);

  const user = await userRepository.createWithProfileAndPage(
    { email, password: hashedPassword, role: 'user' },
    { username, email }
  );

  const token = signToken({ id: user.id, role: user.role });
  delete user.password;

  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const token = signToken({ id: user.id, role: user.role });
  delete user.password;

  return { user, token };
};
