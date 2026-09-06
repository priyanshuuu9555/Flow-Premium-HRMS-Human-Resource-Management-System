/**
 * API base layer — abstracted so the UI never talks to data sources directly.
 *
 * Currently backed by in-memory mock data with simulated network latency.
 * When the Spring Boot backend is ready, swap the mock adapters in each
 * service file for real `fetch` calls against API_BASE_URL — the function
 * signatures and return types stay the same, so no UI changes are needed.
 *
 * Future: React → REST API → Spring Boot → Spring Data JPA → MySQL
 */

export const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL
  || 'http://localhost:8080/api';

const LATENCY = 350;

export const delay = (ms: number = LATENCY) => new Promise((r) => setTimeout(r, ms));

/** Generic fetch wrapper ready for the future Spring Boot backend. */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return (await res.json()) as T;
}

/** In-memory mock store with CRUD helpers + simulated latency. */
export class MockStore<T extends { id: string }> {
  private items: T[];

  constructor(initial: T[]) {
    // defensive copy so the original import is never mutated
    this.items = [...initial];
  }

  async all(): Promise<T[]> {
    await delay();
    return [...this.items];
  }

  async get(id: string): Promise<T | undefined> {
    await delay();
    return this.items.find((i) => i.id === id);
  }

  async create(item: T): Promise<T> {
    await delay();
    this.items = [item, ...this.items];
    return item;
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    await delay();
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Record not found');
    this.items[idx] = { ...this.items[idx], ...patch, id };
    return this.items[idx];
  }

  async remove(id: string): Promise<void> {
    await delay();
    this.items = this.items.filter((i) => i.id !== id);
  }

  /** Synchronous snapshot for immediate reads (dashboard stats, etc.). */
  snapshot(): T[] {
    return [...this.items];
  }
}
