// DOM utility functions

import { logger } from './debug';

/**
 * Wait for a DOM element to be available with exponential backoff
 * @param selector CSS selector for the element
 * @param maxAttempts Maximum number of attempts
 * @param baseDelay Base delay in milliseconds
 * @returns Promise that resolves with the element or rejects after max attempts
 */
export const waitForElement = (
  selector: string,
  maxAttempts: number = 10,
  baseDelay: number = 100
): Promise<Element> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkForElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        logger.debug(`Element found: ${selector}`);
        resolve(element);
        return;
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        logger.warn(`Element not found after ${maxAttempts} attempts: ${selector}`);
        reject(new Error(`Element not found: ${selector}`));
        return;
      }
      
      const delay = Math.pow(2, attempts) * baseDelay;
      logger.debug(`Attempt ${attempts}/${maxAttempts}, retrying in ${delay}ms: ${selector}`);
      setTimeout(checkForElement, delay);
    };
    
    // Check immediately first
    checkForElement();
  });
};

/**
 * Wait for multiple DOM elements to be available
 * @param selectors Array of CSS selectors
 * @param maxAttempts Maximum number of attempts
 * @param baseDelay Base delay in milliseconds
 * @returns Promise that resolves with an array of elements
 */
export const waitForElements = (
  selectors: string[],
  maxAttempts: number = 10,
  baseDelay: number = 100
): Promise<Element[]> => {
  return Promise.all(selectors.map(selector => waitForElement(selector, maxAttempts, baseDelay)));
};

/**
 * Check if an element is visible in the viewport
 * @param element DOM element to check
 * @returns True if element is visible
 */
export const isElementVisible = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Scroll element into view with smooth animation
 * @param element DOM element to scroll to
 * @param behavior Scroll behavior
 */
export const scrollToElement = (
  element: Element,
  behavior: ScrollBehavior = 'smooth'
): void => {
  element.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
};

/**
 * Add event listener with automatic cleanup
 * @param element DOM element
 * @param event Event type
 * @param handler Event handler function
 * @param options Event listener options
 * @returns Cleanup function
 */
export const addEventListenerWithCleanup = (
  element: Element,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): (() => void) => {
  element.addEventListener(event, handler, options);
  
  return () => {
    element.removeEventListener(event, handler, options);
  };
};

/**
 * Debounce function execution
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function execution
 * @param func Function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
