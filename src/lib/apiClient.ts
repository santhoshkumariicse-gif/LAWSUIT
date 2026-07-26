import { logger } from "./logger";

export interface ApiError {
  message: string;
  status: number;
}

interface RequestOptions extends RequestInit {
  data?: any;
}

/**
 * Generic API client wrapper around fetch.
 */
export async function apiClient<T>(
  endpoint: string,
  { data, headers: customHeaders, ...customConfig }: RequestOptions = {}
): Promise<T> {
  const config: RequestInit = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": data ? "application/json" : "",
      ...customHeaders,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(endpoint, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.message || response.statusText || "API request failed";
      
      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };
      
      logger.error("apiClient", `API Error [${endpoint}]`, error);
      throw error;
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: any) {
    if (!err.status) {
      // Network error or parsing error
      logger.error("apiClient", `Network Error [${endpoint}]`, err);
      throw { message: err.message || "Network error", status: 0 };
    }
    throw err;
  }
}
