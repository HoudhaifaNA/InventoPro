import { create } from 'zustand';

import { QueryItem, QueryParameters } from '@/types';
import buildUrl from '@/utils/buildUrl';

interface Resource {
  baseUrl: string;
  fetchedUrl: string;
  results: number;
  queries: QueryParameters;
  selectedItems: string[];
}

export type ResourcesNames = 'products' | 'shipments' | 'sales';

interface ResourceStateMethods {
  setResults: (resource: ResourcesNames, results: number) => void;
  selectItem: (resource: ResourcesNames, id: string) => void;
  selectAll: (resource: ResourcesNames, ids: string[]) => void;
  resetSelected: (resource: ResourcesNames) => void;
  addQuery: (resource: ResourcesNames, newQuery: QueryItem) => void;
  deleteQuery: (resource: ResourcesNames, query: string) => void;
}

interface ResourcesData {
  products: Resource;
  shipments: Resource;
  sales: Resource;
}

type ResourceState = ResourceStateMethods & ResourcesData;

const DEFAULT_STATE: ResourcesData = {
  products: {
    baseUrl: '/products',
    fetchedUrl: '/products',
    results: 0,
    queries: { page: 1, limit: 100 },
    selectedItems: [],
  },
  shipments: {
    baseUrl: '/shipments',
    fetchedUrl: '/shipments',
    results: 0,
    queries: {},
    selectedItems: [],
  },
  sales: {
    baseUrl: '/sales',
    fetchedUrl: '/sales',
    results: 0,
    queries: {},
    selectedItems: [],
  },
};

const useResources = create<ResourceState>()((set) => ({
  ...DEFAULT_STATE,
  setResults: (resource, results) =>
    set((state) => {
      return { [resource]: { ...state[resource], results } };
    }),
  selectItem: (resource, id) =>
    set((state) => {
      const resourceState = state[resource];
      const isSelected = resourceState.selectedItems.indexOf(id) !== -1;
      let updatedSelectedItems: string[] = [];
      if (isSelected) {
        updatedSelectedItems = resourceState.selectedItems.filter((it) => it !== id);
      } else {
        updatedSelectedItems = [...resourceState.selectedItems, id];
      }
      return { [resource]: { ...resourceState, selectedItems: updatedSelectedItems } };
    }),
  selectAll: (resource, ids) =>
    set((state) => {
      const resourceState = state[resource];
      let updatedSelectedItems: string[] = [];
      if (resourceState.results === resourceState.selectedItems.length) {
        updatedSelectedItems = [];
      } else {
        updatedSelectedItems = ids;
      }
      return { [resource]: { ...resourceState, selectedItems: updatedSelectedItems } };
    }),
  resetSelected: (resource) =>
    set((state) => {
      const resourceState = state[resource];

      return { [resource]: { ...resourceState, selectedItems: [] } };
    }),

  addQuery: (resource, { query, value }) =>
    set((state) => {
      const updatedQueries = { ...state[resource].queries, [query]: value };
      const updatedUrl = buildUrl(state[resource].baseUrl, updatedQueries);

      return { [resource]: { ...state[resource], queries: updatedQueries, fetchedUrl: updatedUrl } };
    }),
  deleteQuery: (resource, query) =>
    set((state) => {
      delete state[resource].queries[query];
      const updatedUrl = buildUrl(state[resource].baseUrl, state[resource].queries);

      return { [resource]: { ...state[resource], queries: state[resource].queries, fetchedUrl: updatedUrl } };
    }),
}));

export default useResources;
