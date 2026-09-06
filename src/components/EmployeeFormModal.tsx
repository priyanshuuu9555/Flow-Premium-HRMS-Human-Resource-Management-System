import { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '@/components/ui';
import { employeeService } from '@/services/employeeService';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/utils';
import type { Employee, Department, EmploymentType, EmployeeStatus } from '@/types';

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  employee?: Employee | null;
}

const departments: Department[] = ['Engineering', 'HR', 'Marketing', 'Finance', 'Design', 'Operations'];
const empTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Intern'];
const statuses: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive', 'Probation'];

const colors = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'];

const empty = {
  name: '', email: '', phone: '', department: 'Engineering' as Department,
  designation: '', joiningDate: '', salary: '', employmentType: 'Full-time' as EmploymentType,
  status: 'Active' as EmployeeStatus,
};

export function EmployeeFormModal({ open, onClose, onSave, employee }: EmployeeFormModalProps) {
  const { notify } = useToast();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name, email: employee.email, phone: employee.phone,
        department: employee.department, designation: employee.designation,
        joiningDate: employee.joiningDate, salary: String(employee.salary),
        employmentType: employee.employmentType, status: employee.status,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [employee, open]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name too short';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone) e.phone = 'Phone is required';
    else if (!/^[\d\s+()-]{8,}$/.test(form.phone)) e.phone = 'Invalid phone';
    if (!form.designation.trim()) e.designation = 'Designation is required';
    if (!form.joiningDate) e.joiningDate = 'Joining date is required';
    if (!form.salary || Number(form.salary) <= 0) e.salary = 'Enter a valid salary';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        department: form.department, designation: form.designation.trim(),
        joiningDate: form.joiningDate, salary: Number(form.salary),
        employmentType: form.employmentType, status: form.status,
        avatarColor: employee?.avatarColor || colors[Math.floor(Math.random() * colors.length)],
      };
      if (employee) {
        await employeeService.update(employee.id, data);
        notify('success', 'Employee updated successfully.');
      } else {
        await employeeService.create({ ...data, id: uid('EMP') } as Employee);
        notify('success', 'Employee added successfully.');
      }
      onSave();
      onClose();
    } catch {
      notify('error', 'Could not save employee. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Add New Employee'}
      subtitle={employee ? `Updating ${employee.name}` : 'Fill in the details to add a new team member.'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} loading={saving}>{employee ? 'Save Changes' : 'Add Employee'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="e.g. Aarav Mehta" required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="name@kimoclothing.in" required />
        <Input label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} placeholder="+91 98765 43210" required />
        <Input label="Designation" value={form.designation} onChange={(e) => set('designation', e.target.value)} error={errors.designation} placeholder="e.g. Senior Engineer" required />
        <Select label="Department" value={form.department} onChange={(e) => set('department', e.target.value)} options={departments.map((d) => ({ value: d, label: d }))} required />
        <Select label="Employment Type" value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)} options={empTypes.map((t) => ({ value: t, label: t }))} required />
        <Input label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => set('joiningDate', e.target.value)} error={errors.joiningDate} required />
        <Input label="Annual Salary (₹)" type="number" value={form.salary} onChange={(e) => set('salary', e.target.value)} error={errors.salary} placeholder="e.g. 850000" required />
        <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)} options={statuses.map((s) => ({ value: s, label: s }))} required />
      </form>
    </Modal>
  );
}
