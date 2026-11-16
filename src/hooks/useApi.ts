import { useState, useCallback } from 'react';
import { api } from '../lib/axios';
import { AxiosRequestConfig } from 'axios';

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  request: (...args: any[]) => Promise<T | null>;
}

export function useApi<T = any>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (body?: any, customConfig?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        let response;
        switch (method) {
          case 'GET':
            response = await api.get<T>(url, customConfig);
            break;
          case 'POST':
            response = await api.post<T>(url, body, customConfig);
            break;
          case 'PUT':
            response = await api.put<T>(url, body, customConfig);
            break;
          case 'DELETE':
            response = await api.delete<T>(url, customConfig);
            break;
          default:
            throw new Error(`Método HTTP no soportado: ${method}`);
        }
        setData(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Ocurrió un error inesperado';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { data, loading, error, request };
}