'use client';

import { useState, useCallback } from 'react';
import { getDemoQueryResponse } from '@/mocks/insights';
import type { InsightQueryResult } from '../types';

export function useInsightQuery() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<InsightQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitQuery = useCallback((q: string) => {
    setQuery(q);
    setIsLoading(true);
    setResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = getDemoQueryResponse(q);
      setResult(response);
      setIsLoading(false);
    }, 1500);
  }, []);

  const clearResult = useCallback(() => {
    setQuery('');
    setResult(null);
  }, []);

  return { query, result, isLoading, submitQuery, clearResult };
}
