import { QueryParameters } from '@/types';

const buildUrl = (baseUrl: string, queryParams: QueryParameters): string => {
  const queryParamsList = Object.entries(queryParams).map(([key, value]) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  });

  const queryParamsString = queryParamsList.join('&');

  const formattedUrl = queryParamsList.length > 0 ? `${baseUrl}?${queryParamsString}` : baseUrl;

  return formattedUrl;
};

export default buildUrl;
