import { Modal, Badge, Avatar, Button } from '@/components/ui';
import { Mail, Phone, Building2, Briefcase, Calendar, IndianRupee, UserCheck, X, Pencil } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';
import type { Employee } from '@/types';

interface EmployeeDetailModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit?: () => void;
}

const statusTone = { Active: 'green', 'On Leave': 'amber', Inactive: 'slate', Probation: 'blue' } as const;
const empTypeTone = { 'Full-time': 'brand', 'Part-time': 'slate', Contract: 'amber', Intern: 'blue' } as const;

export function EmployeeDetailModal({ open, onClose, employee, onEdit }: EmployeeDetailModalProps) {
  if (!employee) return null;

  const fields = [
    { icon: <Mail size={16} />, label: 'Email', value: employee.email },
    { icon: <Phone size={16} />, label: 'Phone', value: employee.phone },
    { icon: <Building2 size={16} />, label: 'Department', value: employee.department },
    { icon: <Briefcase size={16} />, label: 'Designation', value: employee.designation },
    { icon: <Calendar size={16} />, label: 'Joining Date', value: formatDate(employee.joiningDate) },
    { icon: <IndianRupee size={16} />, label: 'Annual Salary', value: formatCurrency(employee.salary) },
    { icon: <UserCheck size={16} />, label: 'Employment Type', value: employee.employmentType },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Employee Details"
      subtitle={employee.id}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} icon={<X size={16} />}>Close</Button>
          {onEdit && <Button onClick={onEdit} icon={<Pencil size={16} />}>Edit</Button>}
        </>
      }
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar name={employee.name} color={employee.avatarColor} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-900">{employee.name}</h3>
            <Badge tone={statusTone[employee.status]}>{employee.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{employee.designation} · {employee.department}</p>
          <div className="mt-2 flex gap-2">
            <Badge tone={empTypeTone[employee.employmentType]}>{employee.employmentType}</Badge>
            <Badge tone="slate">ID: {employee.id}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">{f.icon}</div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{f.label}</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-900">{f.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
