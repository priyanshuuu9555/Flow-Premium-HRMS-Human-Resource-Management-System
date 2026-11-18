
import type { AttendanceRecord } from '@/types';
import { apiRequest } from './api';

const URL = '/attendance/';

function mapAttendance(data: any): AttendanceRecord {
  return {
    id: String(data.id),
    employeeId: String(data.employeeId),
    employeeName: data.employeeName,
    date: data.date,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    workingHours: data.workingHours,
    status: data.status,
  };
}

function toBackend(data: Partial<AttendanceRecord>) {
  return {
    employeeId: data.employeeId ? Number(data.employeeId) : undefined,
    date: data.date,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    workingHours: data.workingHours,
    status: data.status,
  };
}

export const attendanceService = {
  getAll: async (): Promise<AttendanceRecord[]> => {
    const data = await apiRequest<any[]>(URL);
    return data.map(mapAttendance);
  },

  create: async (record: AttendanceRecord): Promise<AttendanceRecord> => {
    const data = await apiRequest<any>(URL, {
      method: 'POST',
      body: JSON.stringify(toBackend(record)),
    });
    return mapAttendance(data);
  },

  update: async (
    id: string,
    patch: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord> => {
    const data = await apiRequest<any>(`${URL}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(toBackend(patch)),
    });
    return mapAttendance(data);
  },

  remove: async (id: string): Promise<void> => {
    await apiRequest(`${URL}${id}/`, { method: 'DELETE' });
  },
};
