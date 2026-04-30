// API utility functions

import { logger } from './debug';

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}

/**
 * HTTP request options
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * HTTP response wrapper
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  ok: boolean;
}

/**
 * HTTP client class
 */
export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      withCredentials: config.withCredentials || false,
    };
  }

  /**
   * Make an HTTP request
   */
  async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const fullUrl = this.config.baseURL + url;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout);

    try {
      const response = await fetch(fullUrl, {
        method: options.method || 'GET',
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: this.config.withCredentials ? 'include' : 'same-origin',
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
        ok: response.ok,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'POST', body: data });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PUT', body: data });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PATCH', body: data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

/**
 * API client with common patterns
 */
export class ApiClient {
  private http: HttpClient;

  constructor(baseURL: string) {
    this.http = new HttpClient({ baseURL });
  }

  /**
   * Generic API call with error handling
   */
  async apiCall<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<T> {
    try {
      logger.debug(`API ${method} ${url}`, { data });
      
      const response = await this.http.request<T>(url, {
        method,
        body: data,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      logger.debug(`API ${method} ${url} success`, { response: response.data });
      return response.data;
    } catch (error) {
      logger.error(`API ${method} ${url} failed`, { error, data });
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.apiCall<T>('GET', url, undefined, options);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.apiCall<T>('POST', url, data, options);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.apiCall<T>('PUT', url, data, options);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.apiCall<T>('PATCH', url, data, options);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.apiCall<T>('DELETE', url, undefined, options);
  }
}

/**
 * Retry utility for failed API calls
 */
export class RetryHandler {
  /**
   * Retry a function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`, { error });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: Array<{ timestamp: number }> = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(req => now - req.timestamp < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push({ timestamp: now });
    return true;
  }

  /**
   * Wait until request is allowed
   */
  async waitForAllowance(): Promise<void> {
    while (!this.isAllowed()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

/**
 * Cache utility for API responses
 */
export class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  /**
   * Get cached data
   */
  get<T = any>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Set cached data
   */
  set<T = any>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}
