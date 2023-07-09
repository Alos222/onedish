import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from 'src/types/response/api-response';
import { useNotifications } from './useNotifications';

const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export const useApiRequest = (url: string) => {
  const [loading, setLoading] = useState(false);

  const doFetch = async <Request, Response>(opts: RequestInit): Promise<ApiResponse<Response>> => {
    setLoading(true);
    try {
      const apiUrl = `${baseApiUrl}/${url}`;
      const response = await fetch(apiUrl, opts);

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

  const post = async <Request, Response>(requestData: Request): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>({
      body: JSON.stringify(requestData),
      method: 'POST',
    });
    return result;
  };

  return { post, loading };
};
