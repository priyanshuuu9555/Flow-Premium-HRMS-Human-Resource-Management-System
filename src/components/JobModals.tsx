import { useState, useEffect } from 'react';
import { Modal, Input, Select, Textarea, Button, Badge } from '@/components/ui';
import { jobService } from '@/services/jobService';
import { useToast } from '@/hooks/useToast';
import { uid, todayISO } from '@/utils';
import type { Job, Department, EmploymentType, JobStatus } from '@/types';

interface JobFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  job?: Job | null;
}

const departments: Department[] = ['Engineering', 'HR', 'Marketing', 'Finance', 'Design', 'Operations'];
const empTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Intern'];
const statuses: JobStatus[] = ['Open', 'Closed', 'Draft'];

const empty = {
  title: '', department: 'Engineering' as Department, location: '',
  employmentType: 'Full-time' as EmploymentType, experience: '',
  salaryMin: '', salaryMax: '', description: '', requirements: '',
  status: 'Open' as JobStatus,
};

export function JobFormModal({ open, onClose, onSave, job }: JobFormModalProps) {
  const { notify } = useToast();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title, department: job.department, location: job.location,
        employmentType: job.employmentType, experience: job.experience,
        salaryMin: String(job.salaryMin), salaryMax: String(job.salaryMax),
        description: job.description, requirements: job.requirements.join('\n'),
        status: job.status,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [job, open]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.experience.trim()) e.experience = 'Experience is required';
    if (!form.salaryMin || Number(form.salaryMin) <= 0) e.salaryMin = 'Enter min salary';
    if (!form.salaryMax || Number(form.salaryMax) <= 0) e.salaryMax = 'Enter max salary';
    if (Number(form.salaryMin) > Number(form.salaryMax)) e.salaryMax = 'Max must be higher than min';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.requirements.trim()) e.requirements = 'Add at least one requirement';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        title: form.title.trim(), department: form.department, location: form.location.trim(),
        employmentType: form.employmentType, experience: form.experience.trim(),
        salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax),
        description: form.description.trim(),
        requirements: form.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
        status: form.status,
      };
      if (job) {
        await jobService.update(job.id, data);
        notify('success', 'Job posting updated.');
      } else {
        await jobService.create({ ...data, id: uid('JOB'), postedDate: todayISO() } as Job);
        notify('success', 'Job posting created.');
      }
      onSave();
      onClose();
    } catch {
      notify('error', 'Could not save job posting.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open} onClose={onClose}
      title={job ? 'Edit Job Posting' : 'Create Job Posting'}
      subtitle={job ? job.title : 'Post a new opening for recruitment.'}
      size="xl"
      footer={<><Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button><Button onClick={handleSubmit} loading={saving}>{job ? 'Save Changes' : 'Create Job'}</Button></>}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input label="Job Title" value={form.title} onChange={(e) => set('title', e.target.value)} error={errors.title} placeholder="e.g. Senior Fashion Designer" required />
        </div>
        <Select label="Department" value={form.department} onChange={(e) => set('department', e.target.value)} options={departments.map((d) => ({ value: d, label: d }))} required />
        <Input label="Location" value={form.location} onChange={(e) => set('location', e.target.value)} error={errors.location} placeholder="e.g. Bengaluru, India" required />
        <Select label="Employment Type" value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)} options={empTypes.map((t) => ({ value: t, label: t }))} required />
        <Input label="Experience Required" value={form.experience} onChange={(e) => set('experience', e.target.value)} error={errors.experience} placeholder="e.g. 3+ years" required />
        <Input label="Salary Min (₹)" type="number" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} error={errors.salaryMin} placeholder="e.g. 800000" required />
        <Input label="Salary Max (₹)" type="number" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} error={errors.salaryMax} placeholder="e.g. 1200000" required />
        <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)} options={statuses.map((s) => ({ value: s, label: s }))} required />
        <div className="sm:col-span-2">
          <Textarea label="Job Description" value={form.description} onChange={(e) => set('description', e.target.value)} error={errors.description} rows={3} placeholder="Describe the role and responsibilities..." required />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Requirements (one per line)" value={form.requirements} onChange={(e) => set('requirements', e.target.value)} error={errors.requirements} rows={4} placeholder="5+ years React experience&#10;Strong TypeScript skills&#10;Team leadership" required />
        </div>
      </form>
    </Modal>
  );
}

export function JobDetailModal({ open, onClose, job, onEdit }: { open: boolean; onClose: () => void; job: Job | null; onEdit?: () => void }) {
  if (!job) return null;
  const statusTone = { Open: 'green', Closed: 'red', Draft: 'slate' } as const;
  return (
    <Modal open={open} onClose={onClose} title={job.title} subtitle={`${job.department} · ${job.location}`} size="lg"
      footer={<><Button variant="outline" onClick={onClose}>Close</Button>{onEdit && <Button onClick={onEdit}>Edit</Button>}</>}>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone={statusTone[job.status]}>{job.status}</Badge>
          <Badge tone="blue">{job.employmentType}</Badge>
          <Badge tone="slate">{job.experience}</Badge>
          <Badge tone="brand">₹{job.salaryMin.toLocaleString('en-IN')} – ₹{job.salaryMax.toLocaleString('en-IN')}</Badge>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Description</h4>
          <p className="mt-1.5 text-sm text-slate-600">{job.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Requirements</h4>
          <ul className="mt-2 space-y-1.5">
            {job.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" /> {r}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-400">Posted on {new Date(job.postedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>
    </Modal>
  );
}
