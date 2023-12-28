import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { ProductInsert, products } from '@/db/schema';

enum ORDER_BY {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  STOCK = 'stock',
  RETAIL_PRICE = 'retailPrice',
  WHOLESALE_PRICE = 'wholesalePrice',
}

function isOrderBy(param: string | null): param is ORDER_BY {
  return Object.values(ORDER_BY).includes(param as any);
}

function getStockQuery(stock: string | null): number[] | undefined {
  const stockArr: number[] = [];

  if (stock && stock.split('_').length === 2) {
    stock.split('_').forEach((value) => {
      if (!isNaN(Number(value))) stockArr.push(Number(value));
    });
  }

  return stockArr.length === 2 ? stockArr : undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orderBy = searchParams.get('orderBy');
  const company = searchParams.get('company');
  const category = searchParams.get('category');
  const stock = searchParams.get('stock');
  let orderByParam: string;
  let order: 'asc' | 'desc';

  if (orderBy && orderBy.length > 1) {
    orderByParam = orderBy.startsWith('-') ? orderBy.split('-')[1] : orderBy;
    order = orderBy.startsWith('-') ? 'desc' : 'asc';
  }

  const stockNumbers = getStockQuery(stock);

  // STOCK STATUS HANDLING (FILTER AND SHOW)

  // COMPANY AND CATEGORY HANDLING

  // SALES TABLE

  const products = await db.query.products.findMany({
    orderBy: (products, oper) => {
      return isOrderBy(orderByParam) ? [oper[order](products[orderByParam])] : [oper.desc(products.createdAt)];
    },
    where: (products, { eq, between, and }) => {
      let companyQuery = company ? eq(products.company, company) : undefined;
      let categoryQuery = category ? eq(products.category, category) : undefined;
      let stockQuery = stockNumbers ? between(products.stock, stockNumbers[0], stockNumbers[1]) : undefined;

      return and(companyQuery, categoryQuery, stockQuery);
    },
    with: {
      shipments: {
        columns: {
          productId: false,
          shipmentId: true,
          unitPrice: true,
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
