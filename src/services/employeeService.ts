import type { Employee } from '@/types';
import { MockStore } from './api';
import { employees as seed } from '@/data/mockData';

const store = new MockStore<Employee>(seed);

export const employeeService = {
  /** GET /api/employees */
  getAll: () => store.all(),
  /** GET /api/employees/:id */
  getById: (id: string) => store.get(id),
  /** POST /api/employees */
  create: (e: Employee) => store.create(e),
  /** PUT /api/employees/:id */
  update: (id: string, patch: Partial<Employee>) => store.update(id, patch),
  /** DELETE /api/employees/:id */
  remove: (id: string) => store.remove(id),
  snapshot: () => store.snapshot(),
};
