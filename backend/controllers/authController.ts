import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { eq } from 'drizzle-orm';

import { db } from '../../db';
import { UserSelect, users } from '../../db/schema';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import formatDateTime from '../utils/formatDateTime';

const signToken = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createAndSendToken = (user: UserSelect, res: Response) => {
  const token = signToken(user.username);

  res.cookie('tkn', token, {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
  });

  const signedUser: Partial<UserSelect> = { ...user };

  delete signedUser['password'];

  res.status(200).json({ message: 'Connecté avec succès.', token, user: signedUser });
};

export const getMe = catchAsync((req, res) => {
  res.status(200).json({ status: 'success', user: req.body.user });
});

export const login = catchAsync((req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Veuillez fournir un nom d'utilisateur et un mot de passe.", 403));
  }

  const user = db.select().from(users).where(eq(users.username, username)).get();

  if (!user) {
    return next(new AppError("Désolé, cet utilisateur n'existe pas.", 401));
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError(`Mot de passe incorrect.`, 401));
  }

  createAndSendToken(user, res);
});

export const logout = catchAsync((_req, res) => {
  res.clearCookie('tkn', {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
  });

  res.status(200).json({ message: 'Déconnecté avec succès.' });
});

export const protect = catchAsync((req, _res, next) => {
  const { authorization } = req.headers;
  let token: string;
  let user: UserSelect;

  if (req.cookies.tkn) {
    token = req.cookies.tkn;
  } else if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette fonctionnalité.", 401)
    );
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (typeof decodedToken !== 'string') {
    user = db.select().from(users).where(eq(users.username, decodedToken.username)).get();
  }

  if (!user) {
    return new AppError('Désolé, cet utilisateur ou ce jeton est introuvable.', 401);
  }

  req.body.user = user;

  next();
});

export const updateMe = catchAsync((req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new AppError('Veuillez fournir votre mot de passe actuel valide ainsi que votre nouveau mot de passe', 403)
    );
  }

  const user = db.select().from(users).where(eq(users.username, req.body.user.username)).get();

  if (!user) {
    return next(new AppError("Désolé, cet utilisateur n'existe pas.", 401));
  }

  const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);

  if (!isPasswordCorrect) {
    return next(
      new AppError(
        'Le mot de passe est incorrect. Veuillez vérifier le mot de passe que vous avez saisi et réessayer.',
        401
      )
    );
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 12);

  const updatedUser = db
    .update(users)
    .set({ password: hashedPassword, updatedAt: formatDateTime(new Date()) })
    .where(eq(users.username, req.body.user.username))
    .returning()
    .get();

  createAndSendToken(updatedUser, res);
});

export const confirmAction = catchAsync((req, _res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Veuillez fournir un mot de passe actuel valide.', 403));
  }

  const user = db.select().from(users).where(eq(users.username, req.body.user.username)).get();

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    return next(
      new AppError(
        'Le mot de passe est incorrect. Veuillez vérifier le mot de passe que vous avez saisi et réessayer.',
        401
      )
    );
  }

  next();
});
