// Utility functions for localStorage operations with error handling
export function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return fallback;
  }
}

export function safeJsonStringify(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
}

export function validateFileSize(file: File, maxSizeMB: number = 2): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    console.error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds ${maxSizeMB}MB limit`);
    return false;
  }
  return true;
}
