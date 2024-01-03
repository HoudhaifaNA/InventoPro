import { Request } from 'express';
import { like, eq, between, and, getOrderByOperators } from 'drizzle-orm';

import { products } from '../../db/schema';

enum ORDER_BY {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  STOCK = 'stock',
  RETAIL_PRICE = 'retailPrice',
  WHOLESALE_PRICE = 'wholesalePrice',
}

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

const isOrderBy = (orderByValue: string | null): orderByValue is ORDER_BY => {
  return Object.values(ORDER_BY).includes(orderByValue as any);
};

export const sortResults = (param: any) => {
  const operations = getOrderByOperators();
  let orderByParam: string;
  let order: 'asc' | 'desc';

  if (typeof param === 'string') {
    orderByParam = param.replace('-', '');
    order = param.startsWith('-') ? 'desc' : 'asc';
  }

  return isOrderBy(orderByParam) ? [operations[order](products[orderByParam])] : [operations.desc(products.createdAt)];
};

export const generateFilter = (req: Request) => {
  const { q: query, company, category, stock, retailPrice, wholesalePrice } = req.query;
  let rPrices: number[];
  let wPrices: number[];
  const stockNumbers = typeof stock === 'string' && getStockQuery(stock);
  if (typeof retailPrice === 'string') rPrices = parseRange(retailPrice);
  if (typeof wholesalePrice === 'string') wPrices = parseRange(wholesalePrice);

  let searchQuery = query ? like(products.name, `%${query}%`) : undefined;
  let companyQuery = typeof company === 'string' ? eq(products.company, company) : undefined;
  let categoryQuery = typeof category === 'string' ? eq(products.category, category) : undefined;
  let stockQuery = stockNumbers ? between(products.stock, stockNumbers[0], stockNumbers[1]) : undefined;
  let retailPriceQuery = retailPrice ? between(products.retailPrice, rPrices[0], rPrices[1]) : undefined;
  let wholesalePriceQuery = wholesalePrice ? between(products.wholesalePrice, wPrices[0], wPrices[1]) : undefined;

  return and(searchQuery, companyQuery, categoryQuery, stockQuery, retailPriceQuery, wholesalePriceQuery);
};
