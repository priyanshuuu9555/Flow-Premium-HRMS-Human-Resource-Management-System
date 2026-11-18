
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Simulated delay for services that still use mock data
export const delay = (ms = 350) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// Generic API request wrapper
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'Cannot connect to Django backend. Check whether runserver is running.'
    );
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) as T : null as T;
}

// In-memory mock store for services not yet connected to Django
export class MockStore<T extends { id: string }> {
  private items: T[];

  constructor(initial: T[]) {
    this.items = [...initial];
  }

  async all(): Promise<T[]> {
    await delay();
    return [...this.items];
  }

  async get(id: string): Promise<T | undefined> {
    await delay();
    return this.items.find((item) => item.id === id);
  }

  async create(item: T): Promise<T> {
    await delay();
    this.items = [item, ...this.items];
    return item;
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    await delay();

    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Record not found');
    }

    this.items[index] = {
      ...this.items[index],
      ...patch,
      id,
    };

    return this.items[index];
  }

  async remove(id: string): Promise<void> {
    await delay();
    this.items = this.items.filter((item) => item.id !== id);
  }

  snapshot(): T[] {
    return [...this.items];
  }
}
