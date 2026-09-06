export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive' | 'Probation';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  joiningDate: string;
  salary: number;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  avatarColor: string;
}

export type Department =
  | 'Engineering'
  | 'HR'
  | 'Marketing'
  | 'Finance'
  | 'Design'
  | 'Operations';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string;
  status: AttendanceStatus;
}

export type LeaveType = 'Casual' | 'Sick' | 'Annual' | 'Emergency';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export type JobStatus = 'Open' | 'Closed' | 'Draft';

export interface Job {
  id: string;
  title: string;
  department: Department;
  location: string;
  employmentType: EmploymentType;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string[];
  status: JobStatus;
  postedDate: string;
}

export type RecruitmentStage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Shortlisted'
  | 'Selected';

export interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  department: Department;
  name: string;
  email: string;
  phone: string;
  experience: number;
  stage: RecruitmentStage;
  appliedOn: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR Manager' | 'Employee';
  avatarColor: string;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  gstin: string;
  fiscalYearStart: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
