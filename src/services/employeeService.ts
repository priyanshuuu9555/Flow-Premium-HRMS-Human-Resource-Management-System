
import type { Employee } from '@/types';

const API_URL = 'http://127.0.0.1:8000/api/employees/';

async function apiRequest(
  url: string,
  options: RequestInit = {}
) {
  let response: Response;

  const token = localStorage.getItem('authToken');

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    });
  } catch {
    throw new Error(
      'Cannot connect to Django. Check whether the backend is running.'
    );
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

function mapEmployee(data: any): Employee {
  return {
    id: String(data.id),
    name: data.name,
    email: data.email,
    phone: data.phone,
    department:
      data.department === 'Human Resources'
        ? 'HR'
        : data.department,
    designation: data.designation,
    joiningDate: data.joining_date,
    salary: Number(data.salary),
    employmentType: data.employment_type,
    status: data.status,
    avatarColor: '#0EA5E9',
  };
}

function toBackend(data: Partial<Employee>) {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    department:
      data.department === 'HR'
        ? 'Human Resources'
        : data.department,
    designation: data.designation,
    joining_date: data.joiningDate,
    salary: data.salary,
    employment_type: data.employmentType,
    status: data.status,
  };
}

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const data = await apiRequest(API_URL);

    const records = Array.isArray(data)
      ? data
      : data?.results;

    if (!Array.isArray(records)) {
      throw new Error('Unexpected employee API response format.');
    }

    return records.map(mapEmployee);
  },

  getById: async (id: string): Promise<Employee> => {
    const data = await apiRequest(`${API_URL}${id}/`);
    return mapEmployee(data);
  },

  create: async (employee: Employee): Promise<Employee> => {
    const data = await apiRequest(API_URL, {
      method: 'POST',
      body: JSON.stringify(toBackend(employee)),
    });

    return mapEmployee(data);
  },

  update: async (
    id: string,
    employee: Partial<Employee>
  ): Promise<Employee> => {
    const data = await apiRequest(`${API_URL}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(toBackend(employee)),
    });

    return mapEmployee(data);
  },

  remove: async (id: string): Promise<void> => {
    await apiRequest(`${API_URL}${id}/`, {
      method: 'DELETE',
    });
  },
};
