import { create } from 'zustand';
import { QueryItem, QueryParameters } from '@/types';
import buildUrl from '@/utils/buildUrl';

interface UrlState {
  baseUrl: string;
  fetchedUrl: string;
  results: number;
  queries: QueryParameters;
  setResults: (results: number) => void;
  addQuery: (newQuery: QueryItem) => void;
  deleteQuery: (query: string) => void;
}

const BASE_URL = '/products';

const useProductsUrl = create<UrlState>()((set) => ({
  baseUrl: BASE_URL,
  fetchedUrl: BASE_URL,
  results: 0,
  queries: {},
  setResults: (results) =>
    set(() => {
      return { results };
    }),
  addQuery: ({ query, value }) =>
    set((state) => {
      const updatedQueries = { ...state.queries, [query]: value };
      const updatedUrl = buildUrl(state.baseUrl, updatedQueries);

      return { queries: updatedQueries, fetchedUrl: updatedUrl };
    }),
  deleteQuery: (query) =>
    set((state) => {
      delete state.queries[query];
      const updatedUrl = buildUrl(state.baseUrl, state.queries);

      return { queries: state.queries, fetchedUrl: updatedUrl };
    }),
}));

export default useProductsUrl;
