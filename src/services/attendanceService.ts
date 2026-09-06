import type { AttendanceRecord } from '@/types';
import { MockStore } from './api';
import { attendanceRecords as seed } from '@/data/mockData';

const store = new MockStore<AttendanceRecord>(seed);

export const attendanceService = {
  /** GET /api/attendance */
  getAll: () => store.all(),
  /** POST /api/attendance */
  create: (r: AttendanceRecord) => store.create(r),
  snapshot: () => store.snapshot(),
};
