import type { Job } from '@/types';
import { MockStore } from './api';
import { jobs as seed } from '@/data/mockData';

const store = new MockStore<Job>(seed);

export const jobService = {
  /** GET /api/jobs */
  getAll: () => store.all(),
  /** GET /api/jobs/:id */
  getById: (id: string) => store.get(id),
  /** POST /api/jobs */
  create: (j: Job) => store.create(j),
  /** PUT /api/jobs/:id */
  update: (id: string, patch: Partial<Job>) => store.update(id, patch),
  /** DELETE /api/jobs/:id */
  remove: (id: string) => store.remove(id),
  snapshot: () => store.snapshot(),
};
