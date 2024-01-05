import { useState, useEffect, MutableRefObject } from 'react';
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
  const { data, error, isLoading } = useSWR(`${endpoint}page=${currPage}`, fetcher);

  const results = data ? data[countkey] : 0;
  const resultsLength = results || 0;

  useEffect(() => {
    toggleNextPage(currPage < resultsLength / limit);
  }, [resultsLength, limit, currPage]);

  useEffect(() => {
    if (data && data[recordsKey]) setRecords(records.concat(...data[recordsKey]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const loadMoreBtn = btn.current;

    const handleInts = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].intersectionRatio <= 0) return;

      if (hasNextPage) setCurrPage((prev) => (prev = prev + 1));
    };

    const myObserver = new IntersectionObserver(handleInts, { threshold: 0.1 });

    if (loadMoreBtn) {
      myObserver.observe(loadMoreBtn as Element);
    }

    return () => {
      if (loadMoreBtn) {
        myObserver.unobserve(loadMoreBtn);
      }
    };
  }, [btn, hasNextPage]);

  return { results, records, error, isLoading, hasNextPage };
};

export default useInfinitLoading;
