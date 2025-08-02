/**
 * Test setup configuration for Angular 20 with zoneless change detection
 * Design choice: Custom setup to handle Angular 20 experimental features
 */

// Initialize the Angular testing environment
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment with zone.js support
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Mock global objects that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {
      // Mock implementation
    },
    removeListener: () => {
      // Mock implementation
    },
    addEventListener: () => {
      // Mock implementation
    },
    removeEventListener: () => {
      // Mock implementation
    },
    dispatchEvent: () => {
      // Mock implementation
    },
  }),
});

// Mock ResizeObserver for responsive component testing
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class MockResizeObserver {
    observe() {
      // Mock implementation
    }
    unobserve() {
      // Mock implementation
    }
    disconnect() {
      // Mock implementation
    }
  },
});

// Mock IntersectionObserver for lazy loading and scroll testing
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe() {
      // Mock implementation
    }
    unobserve() {
      // Mock implementation
    }
    disconnect() {
      // Mock implementation
    }
  },
});

// Suppress specific console errors for zoneless testing
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    args[0]?.includes?.('NG0908') || // Angular zoneless warnings
    args[0]?.includes?.('zone-testing.js') ||
    args[0]?.includes?.('fakeAsync') ||
    args[0]?.includes?.('Zone.js')
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Mock fakeAsync and tick for zoneless testing
(globalThis as any).fakeAsync = (fn: Function) => {
  return (...args: any[]) => fn(...args);
};

(globalThis as any).tick = () => {
  // No-op for zoneless
};

(globalThis as any).flush = () => {
  // No-op for zoneless
};
