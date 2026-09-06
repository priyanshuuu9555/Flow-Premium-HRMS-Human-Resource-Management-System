import type { Applicant } from '@/types';
import { MockStore } from './api';
import { applicants as seed } from '@/data/mockData';

const store = new MockStore<Applicant>(seed);

export const recruitmentService = {
  /** GET /api/applicants */
  getAll: () => store.all(),
  /** PUT /api/applicants/:id — move stage */
  update: (id: string, patch: Partial<Applicant>) => store.update(id, patch),
  snapshot: () => store.snapshot(),
};
