import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import axios, { AxiosError } from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(async (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance[method](url, data);
      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  }, []);

  return { loading, error, callApi };
};

export default useApi;