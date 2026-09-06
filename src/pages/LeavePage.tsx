import { useEffect, useState, useMemo } from 'react';
import { Check, X, CalendarDays, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { Card, CardBody, Badge, Avatar, Button, PageHeader, EmptyState, LoadingOverlay, Modal, Input, Select, Textarea, ConfirmDialog } from '@/components/ui';
import { leaveService } from '@/services/leaveService';
import { employeeService } from '@/services/employeeService';
import { useToast } from '@/hooks/useToast';
import { formatDate, daysBetween, uid, todayISO } from '@/utils';
import type { LeaveRequest, LeaveStatus, LeaveType } from '@/types';

const statusTone: Record<LeaveStatus, 'amber' | 'green' | 'red'> = {
  Pending: 'amber', Approved: 'green', Rejected: 'red',
};
const typeTone: Record<LeaveType, 'blue' | 'red' | 'brand' | 'amber'> = {
  Casual: 'blue', Sick: 'red', Annual: 'brand', Emergency: 'amber',
};

export function LeavePage() {
  const { notify } = useToast();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | LeaveStatus>('all');
  const [actionTarget, setActionTarget] = useState<{ leave: LeaveRequest; action: 'approve' | 'reject' } | null>(null);
  const [acting, setActing] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ employeeId: '', leaveType: 'Casual' as LeaveType, startDate: '', endDate: '', reason: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const employees = useMemo(() => employeeService.snapshot(), []);

  const load = async () => {
    setLoading(true);
    const data = await leaveService.getAll();
    setLeaves(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const sorted = [...leaves].sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
    return tab === 'all' ? sorted : sorted.filter((l) => l.status === tab);
  }, [leaves, tab]);

  const counts = useMemo(() => ({
    all: leaves.length,
    Pending: leaves.filter((l) => l.status === 'Pending').length,
    Approved: leaves.filter((l) => l.status === 'Approved').length,
    Rejected: leaves.filter((l) => l.status === 'Rejected').length,
  }), [leaves]);

  const empColor = (id: string) => employees.find((e) => e.id === id)?.avatarColor || '#94a3b8';
  const empName = (id: string) => employees.find((e) => e.id === id)?.name || 'Unknown';

  const doAction = async () => {
    if (!actionTarget) return;
    setActing(true);
    const newStatus: LeaveStatus = actionTarget.action === 'approve' ? 'Approved' : 'Rejected';
    try {
      await leaveService.update(actionTarget.leave.id, { status: newStatus });
      notify('success', `Leave request ${newStatus.toLowerCase()} for ${actionTarget.leave.employeeName}.`);
      setActionTarget(null);
      load();
    } catch {
      notify('error', 'Could not update leave request.');
    } finally {
      setActing(false);
    }
  };

  const validateCreate = () => {
    const e: Record<string, string> = {};
    if (!form.employeeId) e.employeeId = 'Select an employee';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.endDate) e.endDate = 'Required';
    if (form.startDate && form.endDate && form.endDate < form.startDate) e.endDate = 'End date must be after start';
    if (!form.reason.trim()) e.reason = 'Reason is required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateCreate()) return;
    setCreating(true);
    try {
      const days = daysBetween(form.startDate, form.endDate);
      await leaveService.create({
        id: uid('LV'), employeeId: form.employeeId, employeeName: empName(form.employeeId),
        leaveType: form.leaveType, startDate: form.startDate, endDate: form.endDate,
        days, reason: form.reason.trim(), status: 'Pending', appliedOn: todayISO(),
      });
      notify('success', 'Leave request submitted.');
      setCreateOpen(false);
      setForm({ employeeId: '', leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
      load();
    } catch {
      notify('error', 'Could not submit leave request.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Leave Management"
        subtitle="Review and manage employee leave requests"
        action={<Button icon={<Plus size={18} />} onClick={() => setCreateOpen(true)}>New Request</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Requests', value: counts.all, icon: <CalendarDays size={20} />, color: 'bg-brand-50 text-brand-600' },
          { label: 'Pending', value: counts.Pending, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600' },
          { label: 'Approved', value: counts.Approved, icon: <CheckCircle2 size={20} />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Rejected', value: counts.Rejected, icon: <XCircle size={20} />, color: 'bg-red-50 text-red-600' },
        ].map((s) => (
          <Card key={s.label} hover><CardBody>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </CardBody></Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t === 'all' ? 'All' : t} <span className="ml-1 text-xs opacity-75">({counts[t]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingOverlay />
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={<CalendarDays size={28} />} title="No leave requests" message="There are no leave requests in this category." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">Employee</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">From</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">To</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Days</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Reason</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.employeeName} color={empColor(l.employeeId)} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{l.employeeName}</p>
                          <p className="text-xs text-slate-400">{l.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge tone={typeTone[l.leaveType]}>{l.leaveType}</Badge></td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(l.startDate)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(l.endDate)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{l.days}</td>
                    <td className="px-4 py-3 max-w-xs"><p className="truncate text-slate-500" title={l.reason}>{l.reason}</p></td>
                    <td className="px-4 py-3"><Badge tone={statusTone[l.status]}>{l.status}</Badge></td>
                    <td className="px-4 py-3">
                      {l.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setActionTarget({ leave: l, action: 'approve' })}
                            className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50" title="Approve"><Check size={16} /></button>
                          <button onClick={() => setActionTarget({ leave: l, action: 'reject' })}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Reject"><X size={16} /></button>
                        </div>
                      ) : (
                        <span className="block text-right text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Leave Request" subtitle="Submit a leave application on behalf of an employee."
        footer={<><Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>Cancel</Button><Button onClick={handleCreate} loading={creating}>Submit Request</Button></>}>
        <form onSubmit={handleCreate} className="space-y-4">
          <Select label="Employee" value={form.employeeId} onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
            error={formErrors.employeeId} placeholder="Select employee" required
            options={employees.map((e) => ({ value: e.id, label: `${e.name} — ${e.department}` }))} />
          <Select label="Leave Type" value={form.leaveType} onChange={(e) => setForm((p) => ({ ...p, leaveType: e.target.value as LeaveType }))}
            options={['Casual', 'Sick', 'Annual', 'Emergency'].map((t) => ({ value: t, label: t }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} error={formErrors.startDate} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} error={formErrors.endDate} required />
          </div>
          <Textarea label="Reason" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} error={formErrors.reason}
            rows={3} placeholder="Brief reason for the leave..." required />
        </form>
      </Modal>

      {/* Action confirm */}
      <ConfirmDialog
        open={!!actionTarget}
        title={actionTarget?.action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        message={`Are you sure you want to ${actionTarget?.action} the ${actionTarget?.leave.leaveType.toLowerCase()} leave request from ${actionTarget?.leave.employeeName} for ${actionTarget?.leave.days} day(s)?`}
        confirmLabel={actionTarget?.action === 'approve' ? 'Approve' : 'Reject'}
        onConfirm={doAction}
        onCancel={() => setActionTarget(null)}
        loading={acting}
      />
    </div>
  );
}
