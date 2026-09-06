import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, Users, Download } from 'lucide-react';
import { Card, CardBody, Badge, Avatar, Button, Input, Select, PageHeader, EmptyState, LoadingOverlay, ConfirmDialog } from '@/components/ui';
import { EmployeeFormModal } from '@/components/EmployeeFormModal';
import { EmployeeDetailModal } from '@/components/EmployeeDetailModal';
import { employeeService } from '@/services/employeeService';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, formatDate, downloadJSON } from '@/utils';
import type { Employee, Department } from '@/types';

const departments: Department[] = ['Engineering', 'HR', 'Marketing', 'Finance', 'Design', 'Operations'];

const statusTone = { Active: 'green', 'On Leave': 'amber', Inactive: 'slate', Probation: 'blue' } as const;

export function EmployeesPage() {
  const { notify } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await employeeService.getAll();
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q);
      const matchDept = !deptFilter || e.department === deptFilter;
      const matchStatus = !statusFilter || e.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const handleAdd = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (e: Employee) => { setEditing(e); setFormOpen(true); setDetailOpen(false); };
  const handleView = (e: Employee) => { setViewing(e); setDetailOpen(true); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await employeeService.remove(deleteTarget.id);
      notify('success', `${deleteTarget.name} has been removed.`);
      setDeleteTarget(null);
      load();
    } catch {
      notify('error', 'Could not delete employee.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} employees across ${departments.length} departments`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" icon={<Download size={18} />} onClick={() => downloadJSON(filtered, 'employees.json')}>Export</Button>
            <Button icon={<Plus size={18} />} onClick={handleAdd}>Add Employee</Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, ID or designation..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} placeholder="All Departments" options={departments.map((d) => ({ value: d, label: d }))} className="sm:w-48" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="All Statuses" options={['Active', 'On Leave', 'Inactive', 'Probation'].map((s) => ({ value: s, label: s }))} className="sm:w-40" />
          {(search || deptFilter || statusFilter) && (
            <Button variant="ghost" onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}>Clear</Button>
          )}
        </CardBody>
      </Card>

      {loading ? (
        <LoadingOverlay />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users size={28} />}
            title="No employees found"
            message={search || deptFilter || statusFilter ? 'Try adjusting your search or filters.' : 'Add your first employee to get started.'}
            action={<Button icon={<Plus size={18} />} onClick={handleAdd}>Add Employee</Button>}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">Employee</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Department</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Designation</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Joined</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Salary</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((e) => (
                  <tr key={e.id} className="group transition-colors hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={e.name} color={e.avatarColor} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{e.name}</p>
                          <p className="truncate text-xs text-slate-400">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{e.department}</td>
                    <td className="px-4 py-3 text-slate-600">{e.designation}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(e.joiningDate)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{formatCurrency(e.salary)}</td>
                    <td className="px-4 py-3"><Badge tone={statusTone[e.status]}>{e.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                        <button onClick={() => handleView(e)} className="rounded-lg p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-600" title="View"><Eye size={16} /></button>
                        <button onClick={() => handleEdit(e)} className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600" title="Edit"><Pencil size={16} /></button>
                        <button onClick={() => setDeleteTarget(e)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
            Showing {filtered.length} of {employees.length} employees
          </div>
        </Card>
      )}

      <EmployeeFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={load} employee={editing} />
      <EmployeeDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} employee={viewing} onEdit={() => viewing && handleEdit(viewing)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
