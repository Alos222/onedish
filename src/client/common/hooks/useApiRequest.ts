import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from 'src/types/response/api-response';
import { useNotifications } from './useNotifications';

const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export const useApiRequest = (apiUrl: string) => {
  const [loading, setLoading] = useState(false);

  const doFetch = async <Request, Response>(url?: string, opts?: RequestInit): Promise<ApiResponse<Response>> => {
    setLoading(true);
    try {
      let fullUrl = `${baseApiUrl}/${apiUrl}`;
      if (url) {
        fullUrl += `${url}`;
      }
      console.log({ baseApiUrl, apiUrl, url, fullUrl });
      const response = await fetch(fullUrl, opts);

      const result = (await response.json()) as ApiResponse<Response>;

      return result;
    } catch (e) {
      let data: Response | undefined;
      let errorMessage: string;
      const defaultErrorMessage = 'Something went wrong when making API request';
      if (e instanceof AxiosError) {
        data = e.response?.data.data;
        errorMessage = e.response?.data.error || defaultErrorMessage;
        return e.response?.data;
      }

      console.log(defaultErrorMessage, e);
      errorMessage = defaultErrorMessage;
      return {
        data,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const get = async <Response>(url: string): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>(url);
    return result;
  };

  const post = async <Request, Response>(requestData: Request): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>('', {
      body: JSON.stringify(requestData),
      method: 'POST',
    });
    return result;
  };

  const patch = async <Request, Response>(url: string, requestData: Request): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>(url, {
      body: JSON.stringify(requestData),
      method: 'PATCH',
    });
    return result;
  };

  return { get, post, patch, loading };
};
