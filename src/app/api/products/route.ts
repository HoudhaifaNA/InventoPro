import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { ProductInsert, products } from '@/db/schema';

export async function GET() {
  const products = await db.query.products.findMany({
    with: {
      shipments: {
        columns: {
          productId: false,
          shipmentId: true,
          price: true,
          quantity: true,
        },

        with: {
          shipments: {
            columns: {
              shipmentCode: true,
              arrivalDate: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ results: products.length, products }, { status: 200, statusText: 'success' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, ref, company, category, stock, retailPrice, wholesalePrice } = body;
    const newProductBody: ProductInsert = {
      name,
      ref,
      company,
      category,
      stock,
      retailPrice,
      wholesalePrice,
    };

    const [newProduct] = await db.insert(products).values(newProductBody).returning();

    return NextResponse.json(
      { message: 'Product created', product: newProduct },
      { status: 201, statusText: 'success' }
    );
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
