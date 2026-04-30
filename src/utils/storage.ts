// Storage utility functions

/**
 * Local storage wrapper with error handling and type safety
 */
export class LocalStorage {
  /**
   * Set an item in localStorage
   * @param key Storage key
   * @param value Value to store
   */
  static set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to set localStorage item "${key}":`, error);
    }
  }

  /**
   * Get an item from localStorage
   * @param key Storage key
   * @param defaultValue Default value if item doesn't exist
   * @returns Stored value or default
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to get localStorage item "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key Storage key
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage item "${key}":`, error);
    }
  }

  /**
   * Check if an item exists in localStorage
   * @param key Storage key
   * @returns True if item exists
   */
  static has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Failed to check localStorage item "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage items
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get all localStorage keys
   * @returns Array of storage keys
   */
  static keys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Failed to get localStorage keys:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes
   * @returns Storage size in bytes
   */
  static size(): number {
    try {
      let size = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
      return size;
    } catch (error) {
      console.error('Failed to calculate localStorage size:', error);
      return 0;
    }
  }
}

/**
 * Session storage wrapper with error handling and type safety
 */
export class SessionStorage {
  /**
   * Set an item in sessionStorage
   * @param key Storage key
   * @param value Value to store
   */
  static set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to set sessionStorage item "${key}":`, error);
    }
  }

  /**
   * Get an item from sessionStorage
   * @param key Storage key
   * @param defaultValue Default value if item doesn't exist
   * @returns Stored value or default
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to get sessionStorage item "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove an item from sessionStorage
   * @param key Storage key
   */
  static remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove sessionStorage item "${key}":`, error);
    }
  }

  /**
   * Check if an item exists in sessionStorage
   * @param key Storage key
   * @returns True if item exists
   */
  static has(key: string): boolean {
    try {
      return sessionStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Failed to check sessionStorage item "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all sessionStorage items
   */
  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
    }
  }

  /**
   * Get all sessionStorage keys
   * @returns Array of storage keys
   */
  static keys(): string[] {
    try {
      return Object.keys(sessionStorage);
    } catch (error) {
      console.error('Failed to get sessionStorage keys:', error);
      return [];
    }
  }
}

/**
 * Cookie utility functions
 */
export class Cookies {
  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  static set(
    name: string,
    value: string,
    options: {
      expires?: Date | number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ): void {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const expires = options.expires instanceof Date ? options.expires : new Date(options.expires);
      cookie += `; expires=${expires.toUTCString()}`;
    }

    if (options.path) cookie += `; path=${options.path}`;
    if (options.domain) cookie += `; domain=${options.domain}`;
    if (options.secure) cookie += '; secure';
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

    document.cookie = cookie;
  }

  /**
   * Get a cookie value
   * @param name Cookie name
   * @returns Cookie value or null
   */
  static get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    
    return null;
  }

  /**
   * Remove a cookie
   * @param name Cookie name
   * @param path Cookie path
   */
  static remove(name: string, path: string = '/'): void {
    this.set(name, '', { expires: new Date(0), path });
  }

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns True if cookie exists
   */
  static has(name: string): boolean {
    return this.get(name) !== null;
  }
}

/**
 * Storage event listener for cross-tab synchronization
 */
export class StorageSync {
  private static listeners: Map<string, Set<(event: StorageEvent) => void>> = new Map();

  /**
   * Add a storage change listener
   * @param key Storage key to watch
   * @param callback Callback function
   */
  static on(key: string, callback: (event: StorageEvent) => void): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
  }

  /**
   * Remove a storage change listener
   * @param key Storage key
   * @param callback Callback function
   */
  static off(key: string, callback: (event: StorageEvent) => void): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.delete(callback);
      if (keyListeners.size === 0) {
        this.listeners.delete(key);
      }
    }
  }

  /**
   * Initialize storage event listener
   */
  static init(): void {
    window.addEventListener('storage', (event) => {
      const keyListeners = this.listeners.get(event.key || '');
      if (keyListeners) {
        keyListeners.forEach(callback => callback(event));
      }
    });
  }
}

// Initialize storage sync
if (typeof window !== 'undefined') {
  StorageSync.init();
}
