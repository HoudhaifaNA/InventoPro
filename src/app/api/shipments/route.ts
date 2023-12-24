import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const result = await db.query.shipments.findMany({
      with: {
        products: {
          columns: {
            productId: false,
            shipmentId: false,
          },

          with: {
            products: {
              columns: {
                id: true,
                retailPrice: true,
                wholesalePrice: true,
              },
            },
          },
        },
      },
    });


  return NextResponse.json({ result }, { status: 200 });
}
