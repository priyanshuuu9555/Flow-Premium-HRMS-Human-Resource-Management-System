
import type { LeaveRequest } from '@/types';
import { apiRequest } from './api';

const URL = '/leaves/';

function mapLeave(data: any): LeaveRequest {
  return {
    id: String(data.id),
    employeeId: String(data.employeeId),
    employeeName: data.employeeName,
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    days: Number(data.days),
    reason: data.reason,
    status: data.status,
    appliedOn: data.appliedOn,
  };
}

function toBackend(data: Partial<LeaveRequest>) {
  return {
    employeeId: data.employeeId ? Number(data.employeeId) : undefined,
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    days: data.days,
    reason: data.reason,
    status: data.status,
  };
}

export const leaveService = {
  getAll: async (): Promise<LeaveRequest[]> => {
    const data = await apiRequest<any[]>(URL);
    return data.map(mapLeave);
  },

  create: async (record: LeaveRequest): Promise<LeaveRequest> => {
    const data = await apiRequest<any>(URL, {
      method: 'POST',
      body: JSON.stringify(toBackend(record)),
    });
    return mapLeave(data);
  },

  update: async (
    id: string,
    patch: Partial<LeaveRequest>,
  ): Promise<LeaveRequest> => {
    const data = await apiRequest<any>(`${URL}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(toBackend(patch)),
    });
    return mapLeave(data);
  },

  remove: async (id: string): Promise<void> => {
    await apiRequest(`${URL}${id}/`, { method: 'DELETE' });
  },
};

