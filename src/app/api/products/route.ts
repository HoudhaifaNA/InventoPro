import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await db.query.products.findMany({
    with: {
      shipments: {
        columns: {
          productId: false,
          shipmentId: false,
        },

        with: {
          products: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ result }, { status: 200 });
}
