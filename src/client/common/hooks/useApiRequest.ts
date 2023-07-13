import { useState } from 'react';
import axios, { AxiosError } from 'axios';

import { ApiResponse } from 'src/types/response/api-response';

const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
const defaultErrorMessage = 'Something went wrong when making API request';

const handleError = (e: any) => {
  let data: Response | undefined;
  let errorMessage: string;
  if (e instanceof AxiosError) {
    data = e.response?.data.data;
    errorMessage = e.response?.data.error || defaultErrorMessage;
    return e.response?.data;
  }

  console.error(defaultErrorMessage, e);
  errorMessage = defaultErrorMessage;
  return {
    data,
    error: errorMessage,
  };
};

export const useApiRequest = (apiUrl: string) => {
  const [loading, setLoading] = useState(false);

  const doFetch = async <Request, Response>(url?: string, opts?: RequestInit): Promise<ApiResponse<Response>> => {
    setLoading(true);
    try {
      let fullUrl = `${baseApiUrl}/${apiUrl}`;
      if (url) {
        fullUrl += `${url}`;
      }
      const response = await fetch(fullUrl, opts);

      const result = (await response.json()) as ApiResponse<Response>;

      return result;
    } catch (e) {
      return handleError(e);
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

  const postWithUrl = async <Request, Response>(url: string, requestData: Request): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>(url, {
      body: JSON.stringify(requestData),
      method: 'POST',
    });
    return result;
  };

  const postFile = async <Response>(url: string, formData: FormData): Promise<ApiResponse<Response>> => {
    let fullUrl = `${baseApiUrl}/${apiUrl}/${url}`;

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    try {
      setLoading(true);
      const result = await axios.post<ApiResponse<Response>>(fullUrl, formData, config);
      if (result.status === 200) {
        return result.data;
      }
      console.error('Response status was not 200');
      return {
        error: defaultErrorMessage,
      };
    } catch (e) {
      return handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const patch = async <Request, Response>(url: string, requestData: Request): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>(url, {
      body: JSON.stringify(requestData),
      method: 'PATCH',
    });
    return result;
  };

  const deleteApi = async <Response>(url: string): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>(url, {
      method: 'DELETE',
    });
    return result;
  };

  /**
   * We probably should not be including data in a DELETE, but I'm being lazy now
   * @param url
   * @param requestData
   * @returns
   */
  const deleteWithData = async <Request, Response>(
    url: string,
    requestData: Request,
  ): Promise<ApiResponse<Response>> => {
    const result = await doFetch<Request, Response>(url, {
      body: JSON.stringify(requestData),
      method: 'DELETE',
    });
    return result;
  };

  return { get, post, postWithUrl, postFile, patch, deleteApi, deleteWithData, loading };
};
