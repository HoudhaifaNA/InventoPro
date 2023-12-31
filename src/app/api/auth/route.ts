import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { db } from '@/db';
import { UserSelect, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import formatDateTime from '@/utils/formatDateTime';

// import * as S from "../statments/userStatments";
// import AppError from "../utils/AppError";
// import tryCatch from "../utils/tryCatch";
// import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";
// import { User } from "../../interfaces";

const signToken = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createAndSendToken = (user: UserSelect) => {
  const token = signToken(user.username);

  cookies().set('tkn', token, {
    httpOnly: false,
    secure: true,
  });

  const signedUser: Partial<UserSelect> = { ...user };

  delete signedUser['password'];

  return NextResponse.json({ token, user: signedUser }, { status: 200, statusText: 'success' });
};

export async function GET(request: NextRequest) {
  try {
    let token: string | undefined;

    const authorization = request.headers.get('authorization');

    const tknCookie = cookies().get('tkn')?.value;

    if (tknCookie) {
      token = tknCookie;
    } else if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }

    if (!token) {
      throw new Error("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette fonctionnalité.");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decodedToken === 'string') {
      throw new Error('Désolé, cet utilisateur ou ce jeton est introuvable.');
    }

    const user = db.select().from(users).where(eq(users.username, decodedToken.username)).get();

    if (!user) {
      throw new Error('Désolé, cet utilisateur ou ce jeton est introuvable.');
    }

    return NextResponse.json({ message: 'valid user' }, { status: 200, statusText: 'success' });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      throw new Error("Veuillez fournir un nom d'utilisateur et un mot de passe.");
    }

    const user = db.select().from(users).where(eq(users.username, username)).get();

    if (!user) {
      throw new Error("Désolé, cet utilisateur n'existe pas.");
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Mot de passe incorrect.');
    }

    return createAndSendToken(user);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      throw new Error('Veuillez fournir votre mot de passe actuel valide ainsi que votre nouveau mot de passe.');
    }

    const user = db.select().from(users).where(eq(users.username, username)).get();

    if (!user) {
      throw new Error("Désolé, cet utilisateur n'existe pas.");
    }

    const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Mot de passe incorrect.');
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 12);

    const updatedUser = db
      .update(users)
      .set({ password: hashedPassword, updatedAt: formatDateTime(new Date()) })
      .where(eq(users.username, username))
      .returning()
      .get();

    return createAndSendToken(updatedUser);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
