import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

import { UserInsert, users } from '@/db/schema';
import { db } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      throw new Error("Veuillez fournir un nom d'utilisateur et un mot de passe.");
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const userBody: UserInsert = { username, password: hashedPassword };

    const newUser = db.insert(users).values(userBody).returning().get();

    return NextResponse.json({ message: 'user created', user: newUser }, { status: 201, statusText: 'success' });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
