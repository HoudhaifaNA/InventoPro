import { type NextRequest, NextResponse } from 'next/server';
import { like, eq, between, and } from 'drizzle-orm';

import { db } from '@/db';
import { ProductInsert, products } from '@/db/schema';
import handleFileUpload from './handleFileUpload';
import deleteFile from './deleteFile';

enum ORDER_BY {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  STOCK = 'stock',
  RETAIL_PRICE = 'retailPrice',
  WHOLESALE_PRICE = 'wholesalePrice',
}

const isOrderBy = (orderByValue: string | null): orderByValue is ORDER_BY => {
  return Object.values(ORDER_BY).includes(orderByValue as any);
};

const parseRange = (value: string): number[] => {
  const rangeArr = [0, Infinity];
  value.split('_').forEach((range, ind) => {
    if (!isNaN(parseInt(range))) rangeArr[ind] = parseInt(range);
  });
  return rangeArr;
};

const getStockQuery = (stock: string | null) => {
  let stockArr: number[] = [];
  if (stock) stockArr = parseRange(stock);

  return stockArr.length === 2 ? stockArr : undefined;
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const query = searchParams.get('q');
  const page = searchParams.get('page');
  const orderBy = searchParams.get('orderBy');
  const company = searchParams.get('company');
  const category = searchParams.get('category');
  const stock = searchParams.get('stock');
  const retailPrice = searchParams.get('retailPrice');
  const wholesalePrice = searchParams.get('wholesalePrice');

  const pageNumber = page && !isNaN(parseInt(page)) ? parseInt(page) : 1;
  const limit = 5;
  const offset = limit * pageNumber - limit;

  let orderByParam: string;
  let order: 'asc' | 'desc';
  let rPrices: number[];
  let wPrices: number[];

  if (orderBy) {
    orderByParam = orderBy.replace('-', '');
    order = orderBy.startsWith('-') ? 'desc' : 'asc';
  }

  const stockNumbers = getStockQuery(stock);
  if (retailPrice) rPrices = parseRange(retailPrice);
  if (wholesalePrice) wPrices = parseRange(wholesalePrice);

  const generateFilter = () => {
    let searchQuery = query ? like(products.name, `%${query}%`) : undefined;
    let companyQuery = company ? eq(products.company, company) : undefined;
    let categoryQuery = category ? eq(products.category, category) : undefined;
    let stockQuery = stockNumbers ? between(products.stock, stockNumbers[0], stockNumbers[1]) : undefined;
    let retailPriceQuery = retailPrice ? between(products.retailPrice, rPrices[0], rPrices[1]) : undefined;
    let wholesalePriceQuery = wholesalePrice ? between(products.wholesalePrice, wPrices[0], wPrices[1]) : undefined;

    return and(searchQuery, companyQuery, categoryQuery, stockQuery, retailPriceQuery, wholesalePriceQuery);
  };

  const allProducts = await db.query.products.findMany({ where: generateFilter() });

  const productsList = await db.query.products.findMany({
    orderBy: (products, oper) => {
      return isOrderBy(orderByParam) ? [oper[order](products[orderByParam])] : [oper.desc(products.createdAt)];
    },
    where: generateFilter(),
    limit,
    offset,
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

  const companiesList = await db
    .select({ company: products.company })
    .from(products)
    .groupBy((t) => [t.company]);

  const categoriesList = await db
    .select({ category: products.category })
    .from(products)
    .groupBy((t) => [t.category]);

  return NextResponse.json(
    { results: allProducts.length, start: offset + 1, products: productsList, companiesList, categoriesList },
    { status: 200, statusText: 'success' }
  );
}

export async function POST(request: NextRequest) {
  let thumbnail;

  try {
    const data = await request.formData();

    const body: any = {};
    data.forEach((value, key) => (body[key] = value));

    const { name, ref, company, category, stock, retailPrice, file, wholesalePrice } = body;

    const isValidFile = file instanceof File && file.type.startsWith('image');

    if (isValidFile) {
      thumbnail = await handleFileUpload(file);
    }

    const newProductBody: ProductInsert = {
      name,
      ref,
      company,
      thumbnail,
      category,
      stock,
      retailPrice,
      wholesalePrice,
    };

    const newProduct = db.insert(products).values(newProductBody).returning().get();

    return NextResponse.json(
      { message: 'Product created', product: newProduct },
      { status: 201, statusText: 'success' }
    );
  } catch (err) {
    console.log(err);

    if (thumbnail) {
      deleteFile(thumbnail);
    }

    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
