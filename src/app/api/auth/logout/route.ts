import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    cookies().delete('tkn');

  return  NextResponse.json({ message: 'logout successfully' }, { status: 200, statusText: 'success' });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
