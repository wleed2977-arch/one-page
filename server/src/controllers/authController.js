import * as authService from '../services/authService.js';
import { sendResponse } from '../utils/response.js';

const setTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.registerUser(email, password);
    
    setTokenCookie(res, token);
    
    sendResponse(res, 201, true, 'User registered successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    
    setTokenCookie(res, token);
    
    sendResponse(res, 200, true, 'Login successful', { user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });
    sendResponse(res, 200, true, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req, res, next) => {
  try {
    const user = req.user;
    delete user.password;
    sendResponse(res, 200, true, 'Current user', { user });
  } catch (error) {
    next(error);
  }
};
