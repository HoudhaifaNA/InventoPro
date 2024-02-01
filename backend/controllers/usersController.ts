import bcrypt from 'bcryptjs';

import { db } from '../../db';
import { UserInsert, users } from '../../db/schema';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

export const createUser = catchAsync((req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Veuillez fournir un nom d'utilisateur et un mot de passe.", 403));
  }

  const hashedPassword = bcrypt.hashSync(password, 12);

  const userBody: UserInsert = { username, password: hashedPassword };

  const newUser = db.insert(users).values(userBody).returning().get();

  res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
});
