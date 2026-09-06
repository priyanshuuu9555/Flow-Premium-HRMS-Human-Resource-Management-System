import type {
  Employee, AttendanceRecord, LeaveRequest, Job, Applicant, User, CompanyInfo,
} from '@/types';

export const currentUser: User = {
  id: 'u_001',
  name: 'Aarav Mehta',
  email: 'aarav.mehta@kimoclothing.in',
  role: 'HR Manager',
  avatarColor: '#0EA5E9',
};

export const companyInfo: CompanyInfo = {
  name: 'KIMO Clothing Design Concept',
  legalName: 'KIMO Clothing Design Concept Pvt. Ltd.',
  email: 'hr@kimoclothing.in',
  phone: '+91 80 4567 8900',
  website: 'www.kimoclothing.in',
  address: 'Plot 14, Apparel Park, Doddaballapur Industrial Area',
  city: 'Bengaluru',
  state: 'Karnataka',
  zip: '561203',
  country: 'India',
  gstin: '29AAGCK1234M1Z5',
  fiscalYearStart: 'April',
};

const colors = [
  '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
  '#14B8A6', '#F97316', '#6366F1', '#84CC16',
];

export const employees: Employee[] = [
  { id: 'EMP-001', name: 'Aarav Mehta', email: 'aarav.mehta@kimoclothing.in', phone: '+91 98765 43210', department: 'HR', designation: 'HR Manager', joiningDate: '2021-03-15', salary: 850000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[0] },
  { id: 'EMP-002', name: 'Diya Sharma', email: 'diya.sharma@kimoclothing.in', phone: '+91 98765 43211', department: 'Engineering', designation: 'Senior Software Engineer', joiningDate: '2020-07-01', salary: 1450000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[1] },
  { id: 'EMP-003', name: 'Arjun Nair', email: 'arjun.nair@kimoclothing.in', phone: '+91 98765 43212', department: 'Engineering', designation: 'Frontend Developer', joiningDate: '2022-01-10', salary: 920000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[2] },
  { id: 'EMP-004', name: 'Ananya Reddy', email: 'ananya.reddy@kimoclothing.in', phone: '+91 98765 43213', department: 'Design', designation: 'Lead UI/UX Designer', joiningDate: '2021-09-20', salary: 1100000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[3] },
  { id: 'EMP-005', name: 'Vivaan Gupta', email: 'vivaan.gupta@kimoclothing.in', phone: '+91 98765 43214', department: 'Marketing', designation: 'Marketing Manager', joiningDate: '2020-11-05', salary: 1050000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[4] },
  { id: 'EMP-006', name: 'Ishaan Verma', email: 'ishaan.verma@kimoclothing.in', phone: '+91 98765 43215', department: 'Finance', designation: 'Financial Analyst', joiningDate: '2022-04-18', salary: 780000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[5] },
  { id: 'EMP-007', name: 'Saanvi Iyer', email: 'saanvi.iyer@kimoclothing.in', phone: '+91 98765 43216', department: 'Operations', designation: 'Operations Lead', joiningDate: '2021-06-12', salary: 980000, employmentType: 'Full-time', status: 'On Leave', avatarColor: colors[6] },
  { id: 'EMP-008', name: 'Aditya Joshi', email: 'aditya.joshi@kimoclothing.in', phone: '+91 98765 43217', department: 'Engineering', designation: 'Backend Developer', joiningDate: '2023-02-01', salary: 880000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[7] },
  { id: 'EMP-009', name: 'Kiara Desai', email: 'kiara.desai@kimoclothing.in', phone: '+91 98765 43218', department: 'Design', designation: 'Graphic Designer', joiningDate: '2023-05-22', salary: 650000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[8] },
  { id: 'EMP-010', name: 'Reyansh Kapoor', email: 'reyansh.kapoor@kimoclothing.in', phone: '+91 98765 43219', department: 'Marketing', designation: 'Social Media Executive', joiningDate: '2023-08-15', salary: 520000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[9] },
  { id: 'EMP-011', name: 'Myra Singh', email: 'myra.singh@kimoclothing.in', phone: '+91 98765 43220', department: 'HR', designation: 'HR Executive', joiningDate: '2022-09-01', salary: 620000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[0] },
  { id: 'EMP-012', name: 'Kabir Malhotra', email: 'kabir.malhotra@kimoclothing.in', phone: '+91 98765 43221', department: 'Finance', designation: 'Accountant', joiningDate: '2021-12-10', salary: 720000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[1] },
  { id: 'EMP-013', name: 'Anika Rao', email: 'anika.rao@kimoclothing.in', phone: '+91 98765 43222', department: 'Engineering', designation: 'QA Engineer', joiningDate: '2023-03-08', salary: 750000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[2] },
  { id: 'EMP-014', name: 'Veer Chauhan', email: 'veer.chauhan@kimoclothing.in', phone: '+91 98765 43223', department: 'Operations', designation: 'Warehouse Supervisor', joiningDate: '2022-06-20', salary: 580000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[3] },
  { id: 'EMP-015', name: 'Aadhya Pillai', email: 'aadhya.pillai@kimoclothing.in', phone: '+91 98765 43224', department: 'Design', designation: 'Fashion Designer', joiningDate: '2021-04-25', salary: 950000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[4] },
  { id: 'EMP-016', name: 'Arnav Saxena', email: 'arnav.saxena@kimoclothing.in', phone: '+91 98765 43225', department: 'Engineering', designation: 'DevOps Engineer', joiningDate: '2022-11-15', salary: 1250000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[5] },
  { id: 'EMP-017', name: 'Navya Agarwal', email: 'navya.agarwal@kimoclothing.in', phone: '+91 98765 43226', department: 'Marketing', designation: 'Content Strategist', joiningDate: '2023-06-01', salary: 680000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[6] },
  { id: 'EMP-018', name: 'Atharva Kulkarni', email: 'atharva.kulkarni@kimoclothing.in', phone: '+91 98765 43227', department: 'Operations', designation: 'Logistics Coordinator', joiningDate: '2023-01-12', salary: 540000, employmentType: 'Contract', status: 'Active', avatarColor: colors[7] },
  { id: 'EMP-019', name: 'Ira Bhat', email: 'ira.bhat@kimoclothing.in', phone: '+91 98765 43228', department: 'HR', designation: 'Recruitment Specialist', joiningDate: '2022-03-18', salary: 700000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[8] },
  { id: 'EMP-020', name: 'Dhruv Menon', email: 'dhruv.menon@kimoclothing.in', phone: '+91 98765 43229', department: 'Engineering', designation: 'Tech Lead', joiningDate: '2020-05-01', salary: 1800000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[9] },
  { id: 'EMP-021', name: 'Sara Fernandes', email: 'sara.fernandes@kimoclothing.in', phone: '+91 98765 43230', department: 'Finance', designation: 'Payroll Specialist', joiningDate: '2023-04-10', salary: 660000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[0] },
  { id: 'EMP-022', name: 'Ayaan Chawla', email: 'ayaan.chawla@kimoclothing.in', phone: '+91 98765 43231', department: 'Design', designation: 'Product Designer', joiningDate: '2023-07-19', salary: 890000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[1] },
  { id: 'EMP-023', name: 'Riya Banerjee', email: 'riya.banerjee@kimoclothing.in', phone: '+91 98765 43232', department: 'Marketing', designation: 'Brand Manager', joiningDate: '2021-08-14', salary: 1150000, employmentType: 'Full-time', status: 'Active', avatarColor: colors[2] },
  { id: 'EMP-024', name: 'Kiaan Trivedi', email: 'kiaan.trivedi@kimoclothing.in', phone: '+91 98765 43233', department: 'Operations', designation: 'Procurement Officer', joiningDate: '2022-10-05', salary: 610000, employmentType: 'Full-time', status: 'Probation', avatarColor: colors[3] },
  { id: 'EMP-025', name: 'Tara Mishra', email: 'tara.mishra@kimoclothing.in', phone: '+91 98765 43234', department: 'Engineering', designation: 'Junior Developer', joiningDate: '2024-01-08', salary: 480000, employmentType: 'Intern', status: 'Active', avatarColor: colors[4] },
];

export const attendanceRecords: AttendanceRecord[] = (() => {
  const today = new Date();
  const records: AttendanceRecord[] = [];
  for (let day = 0; day < 7; day++) {
    const d = new Date(today);
    d.setDate(d.getDate() - day);
    const iso = d.toISOString().slice(0, 10);
    employees.forEach((emp, i) => {
      let status: AttendanceRecord['status'] = 'Present';
      let checkIn: string | null = '09:00';
      let checkOut: string | null = '18:00';
      let hours = '9h 00m';
      const rnd = (i + day * 3) % 10;
      if (rnd === 0) { status = 'Absent'; checkIn = null; checkOut = null; hours = '0h'; }
      else if (rnd === 1) { status = 'Late'; checkIn = '09:45'; checkOut = '18:10'; hours = '8h 25m'; }
      else if (rnd === 2) { status = 'Half Day'; checkIn = '09:05'; checkOut = '13:00'; hours = '3h 55m'; }
      else if (rnd === 3 && emp.status === 'On Leave') { status = 'Leave'; checkIn = null; checkOut = null; hours = '0h'; }
      else { checkIn = `09:${(i % 10).toString().padStart(2, '0')}`; checkOut = `18:${((i + 5) % 10).toString().padStart(2, '0')}`; }
      records.push({
        id: `ATT-${iso}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        date: iso,
        checkIn,
        checkOut,
        workingHours: hours,
        status,
      });
    });
  }
  return records;
})();

export const leaveRequests: LeaveRequest[] = [
  { id: 'LV-001', employeeId: 'EMP-007', employeeName: 'Saanvi Iyer', leaveType: 'Sick', startDate: '2026-09-02', endDate: '2026-09-06', days: 5, reason: 'Recovering from viral fever, doctor advised rest.', status: 'Approved', appliedOn: '2026-08-30' },
  { id: 'LV-002', employeeId: 'EMP-003', employeeName: 'Arjun Nair', leaveType: 'Casual', startDate: '2026-09-10', endDate: '2026-09-10', days: 1, reason: 'Personal errand — passport renewal appointment.', status: 'Pending', appliedOn: '2026-09-04' },
  { id: 'LV-003', employeeId: 'EMP-005', employeeName: 'Vivaan Gupta', leaveType: 'Annual', startDate: '2026-09-15', endDate: '2026-09-20', days: 6, reason: 'Family vacation to Goa, planned in advance.', status: 'Pending', appliedOn: '2026-09-03' },
  { id: 'LV-004', employeeId: 'EMP-010', employeeName: 'Reyansh Kapoor', leaveType: 'Emergency', startDate: '2026-09-05', endDate: '2026-09-06', days: 2, reason: 'Family emergency — relative hospitalised.', status: 'Pending', appliedOn: '2026-09-05' },
  { id: 'LV-005', employeeId: 'EMP-014', employeeName: 'Veer Chauhan', leaveType: 'Casual', startDate: '2026-08-25', endDate: '2026-08-25', days: 1, reason: 'Attending a wedding ceremony.', status: 'Approved', appliedOn: '2026-08-20' },
  { id: 'LV-006', employeeId: 'EMP-018', employeeName: 'Atharva Kulkarni', leaveType: 'Sick', startDate: '2026-08-28', endDate: '2026-08-29', days: 2, reason: 'Migraine and severe headache.', status: 'Rejected', appliedOn: '2026-08-27' },
  { id: 'LV-007', employeeId: 'EMP-012', employeeName: 'Kabir Malhotra', leaveType: 'Annual', startDate: '2026-09-22', endDate: '2026-09-25', days: 4, reason: 'Home visit to Kerala.', status: 'Pending', appliedOn: '2026-09-05' },
];

export const jobs: Job[] = [
  {
    id: 'JOB-001', title: 'Senior Full-Stack Engineer', department: 'Engineering', location: 'Bengaluru, India',
    employmentType: 'Full-time', experience: '5+ years', salaryMin: 1500000, salaryMax: 2200000,
    description: 'Lead development of our internal HRMS and e-commerce platform using React, Node, and Spring Boot.',
    requirements: ['5+ years React & TypeScript', 'Strong Java/Spring Boot experience', 'AWS / cloud experience', 'Team leadership'],
    status: 'Open', postedDate: '2026-08-20',
  },
  {
    id: 'JOB-002', title: 'Fashion Designer — Womenswear', department: 'Design', location: 'Bengaluru, India',
    employmentType: 'Full-time', experience: '3+ years', salaryMin: 800000, salaryMax: 1200000,
    description: 'Design seasonal womenswear collections for KIMO’s premium line, from concept to production-ready tech packs.',
    requirements: ['Degree in Fashion Design', '3+ years womenswear experience', 'Adobe Illustrator & Clo3D', 'Strong trend awareness'],
    status: 'Open', postedDate: '2026-08-15',
  },
  {
    id: 'JOB-003', title: 'Digital Marketing Specialist', department: 'Marketing', location: 'Remote, India',
    employmentType: 'Full-time', experience: '2+ years', salaryMin: 600000, salaryMax: 900000,
    description: 'Own performance marketing campaigns across Meta, Google Ads and influencer partnerships for KIMO brand.',
    requirements: ['2+ years paid social experience', 'Google Ads certification', 'Analytics & reporting skills', 'E-commerce background a plus'],
    status: 'Open', postedDate: '2026-08-25',
  },
  {
    id: 'JOB-004', title: 'Payroll & Compliance Executive', department: 'Finance', location: 'Bengaluru, India',
    employmentType: 'Full-time', experience: '3+ years', salaryMin: 700000, salaryMax: 950000,
    description: 'Manage monthly payroll, PF/ESI compliance, TDS and vendor payments for 200+ employees.',
    requirements: ['3+ years payroll experience', 'Knowledge of Indian payroll & statutory compliance', 'Tally / SAP experience', 'CA Inter preferred'],
    status: 'Open', postedDate: '2026-08-28',
  },
  {
    id: 'JOB-005', title: 'Warehouse Operations Manager', department: 'Operations', location: 'Bengaluru, India',
    employmentType: 'Full-time', experience: '6+ years', salaryMin: 1100000, salaryMax: 1500000,
    description: 'Oversee 40,000 sq ft apparel warehouse, inbound/outbound, inventory accuracy and team of 30+.',
    requirements: ['6+ years warehouse/operations', 'WMS implementation experience', 'Lean / Six Sigma preferred', 'Team management'],
    status: 'Draft', postedDate: '2026-09-01',
  },
  {
    id: 'JOB-006', title: 'UI/UX Designer (Internship)', department: 'Design', location: 'Bengaluru, India',
    employmentType: 'Intern', experience: '0-1 years', salaryMin: 20000, salaryMax: 30000,
    description: '3-month design internship working on KIMO’s customer-facing app and internal tools.',
    requirements: ['Portfolio of design projects', 'Figma proficiency', 'Understanding of design systems', 'Currently pursuing design degree'],
    status: 'Closed', postedDate: '2026-06-10',
  },
];

export const applicants: Applicant[] = [
  { id: 'APP-001', jobId: 'JOB-001', jobTitle: 'Senior Full-Stack Engineer', department: 'Engineering', name: 'Rohan Krishnan', email: 'rohan.k@gmail.com', phone: '+91 99876 54321', experience: 6, stage: 'Interview', appliedOn: '2026-08-22' },
  { id: 'APP-002', jobId: 'JOB-001', jobTitle: 'Senior Full-Stack Engineer', department: 'Engineering', name: 'Nisha Patel', email: 'nisha.patel@gmail.com', phone: '+91 99876 12345', experience: 7, stage: 'Shortlisted', appliedOn: '2026-08-21' },
  { id: 'APP-003', jobId: 'JOB-001', jobTitle: 'Senior Full-Stack Engineer', department: 'Engineering', name: 'Karthik Subramaniam', email: 'karthik.sub@gmail.com', phone: '+91 99876 98765', experience: 5, stage: 'Screening', appliedOn: '2026-08-23' },
  { id: 'APP-004', jobId: 'JOB-001', jobTitle: 'Senior Full-Stack Engineer', department: 'Engineering', name: 'Pooja Hegde', email: 'pooja.hegde@gmail.com', phone: '+91 99876 11111', experience: 8, stage: 'Selected', appliedOn: '2026-08-19' },
  { id: 'APP-005', jobId: 'JOB-001', jobTitle: 'Senior Full-Stack Engineer', department: 'Engineering', name: 'Sundeep Rao', email: 'sundeep.rao@gmail.com', phone: '+91 99876 22222', experience: 4, stage: 'Applied', appliedOn: '2026-08-24' },
  { id: 'APP-006', jobId: 'JOB-002', jobTitle: 'Fashion Designer — Womenswear', department: 'Design', name: 'Aishwarya Gowda', email: 'aish.gowda@gmail.com', phone: '+91 99876 33333', experience: 4, stage: 'Interview', appliedOn: '2026-08-17' },
  { id: 'APP-007', jobId: 'JOB-002', jobTitle: 'Fashion Designer — Womenswear', department: 'Design', name: 'Meera Kothari', email: 'meera.kothari@gmail.com', phone: '+91 99876 44444', experience: 3, stage: 'Screening', appliedOn: '2026-08-18' },
  { id: 'APP-008', jobId: 'JOB-002', jobTitle: 'Fashion Designer — Womenswear', department: 'Design', name: 'Deepa Nambiar', email: 'deepa.nambiar@gmail.com', phone: '+91 99876 55555', experience: 5, stage: 'Applied', appliedOn: '2026-08-20' },
  { id: 'APP-009', jobId: 'JOB-003', jobTitle: 'Digital Marketing Specialist', department: 'Marketing', name: 'Shreya Bhatia', email: 'shreya.bhatia@gmail.com', phone: '+91 99876 66666', experience: 3, stage: 'Shortlisted', appliedOn: '2026-08-26' },
  { id: 'APP-010', jobId: 'JOB-003', jobTitle: 'Digital Marketing Specialist', department: 'Marketing', name: 'Aman Wadhwa', email: 'aman.wadhwa@gmail.com', phone: '+91 99876 77777', experience: 2, stage: 'Applied', appliedOn: '2026-08-27' },
  { id: 'APP-011', jobId: 'JOB-004', jobTitle: 'Payroll & Compliance Executive', department: 'Finance', name: 'Gauri Sane', email: 'gauri.sane@gmail.com', phone: '+91 99876 88888', experience: 4, stage: 'Interview', appliedOn: '2026-08-29' },
  { id: 'APP-012', jobId: 'JOB-004', jobTitle: 'Payroll & Compliance Executive', department: 'Finance', name: 'Nikhil Joshi', email: 'nikhil.j@gmail.com', phone: '+91 99876 99999', experience: 3, stage: 'Applied', appliedOn: '2026-08-30' },
];
