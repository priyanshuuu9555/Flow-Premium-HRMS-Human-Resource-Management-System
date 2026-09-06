import type { LeaveRequest } from '@/types';
import { MockStore } from './api';
import { leaveRequests as seed } from '@/data/mockData';

const store = new MockStore<LeaveRequest>(seed);

export const leaveService = {
  /** GET /api/leaves */
  getAll: () => store.all(),
  /** POST /api/leaves */
  create: (l: LeaveRequest) => store.create(l),
  /** PUT /api/leaves/:id — approve / reject / update */
  update: (id: string, patch: Partial<LeaveRequest>) => store.update(id, patch),
  snapshot: () => store.snapshot(),
};
