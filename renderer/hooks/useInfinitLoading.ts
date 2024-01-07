import { useState, useEffect, MutableRefObject, useCallback, useRef } from 'react';
import useSWR from 'swr';

import { fetcher } from '@/utils/API';

interface Config {
  endpoint: string;
  limit?: number;
  countkey: string;
  recordsKey: string;
  btn: MutableRefObject<any>;
}

const useInfinitLoading = <T>(config: Config) => {
  const { endpoint, limit = 5, countkey, recordsKey, btn } = config;
  const [currPage, setCurrPage] = useState(1);
  const [hasNextPage, toggleNextPage] = useState(false);
  const [records, setRecords] = useState<T[]>([]);
  const prevEndpoint = useRef(endpoint);
  const generateUrl = (nun: number) => {
    return endpoint.includes('?') ? `${endpoint}&page=${nun}` : `${endpoint}?page=${nun}`;
  };

  const url = prevEndpoint.current !== endpoint ? generateUrl(1) : generateUrl(currPage);
  const { data, error, isLoading } = useSWR(url, fetcher);
  const newRecords = useRef(records);
  const results = data ? data[countkey] : 0;
  const resultsLength = results || 0;

  useEffect(() => {
    prevEndpoint.current = endpoint;
    setCurrPage(1);
    newRecords.current = [];
  }, [endpoint]);

  useEffect(() => {
    const pagesCount = resultsLength / limit;
    toggleNextPage(currPage < pagesCount);
  }, [resultsLength, limit, currPage]);

  useEffect(() => {
    if (data && data[recordsKey]) {
      const updatedRecords: T[] = Array.from(
        new Map([...newRecords.current, ...data[recordsKey]].map((item) => [item.id, item]))
      ).map(([_id, item]) => item);

      setRecords(updatedRecords);
      newRecords.current = updatedRecords;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const loadMoreBtn = btn.current;

    const handleInts = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].intersectionRatio <= 0) return;

      if (hasNextPage) setCurrPage((prev) => (prev = prev + 1));
    };

    const myObserver = new IntersectionObserver(handleInts);

    if (loadMoreBtn) {
      myObserver.observe(loadMoreBtn as Element);
    }

    return () => {
      if (loadMoreBtn) {
        myObserver.unobserve(loadMoreBtn);
      }
    };
  }, [btn, hasNextPage]);

  return { results, data, records, error, isLoading, hasNextPage };
};

export default useInfinitLoading;
