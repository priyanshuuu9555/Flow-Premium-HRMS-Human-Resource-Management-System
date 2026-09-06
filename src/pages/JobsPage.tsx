import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, Briefcase, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { Card, CardBody, Badge, Button, PageHeader, EmptyState, LoadingOverlay, ConfirmDialog, Select } from '@/components/ui';
import { JobFormModal, JobDetailModal } from '@/components/JobModals';
import { jobService } from '@/services/jobService';
import { recruitmentService } from '@/services/recruitmentService';
import { useToast } from '@/hooks/useToast';
import { formatCurrencyRange, formatDate } from '@/utils';
import type { Job, JobStatus } from '@/types';

const statusTone: Record<JobStatus, 'green' | 'red' | 'slate'> = { Open: 'green', Closed: 'red', Draft: 'slate' };

export function JobsPage() {
  const { notify } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [viewing, setViewing] = useState<Job | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await jobService.getAll();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const applicantCounts = useMemo(() => {
    const m: Record<string, number> = {};
    recruitmentService.snapshot().forEach((a) => { m[a.jobId] = (m[a.jobId] || 0) + 1; });
    return m;
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const q = search.toLowerCase();
      const matchSearch = !q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
      const matchStatus = !statusFilter || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  const handleAdd = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (j: Job) => { setEditing(j); setFormOpen(true); setDetailOpen(false); };
  const handleView = (j: Job) => { setViewing(j); setDetailOpen(true); };

  const cycleStatus = async (j: Job) => {
    const order: JobStatus[] = ['Open', 'Closed', 'Draft'];
    const next = order[(order.indexOf(j.status) + 1) % order.length];
    try {
      await jobService.update(j.id, { status: next });
      notify('success', `${j.title} is now ${next}.`);
      load();
    } catch {
      notify('error', 'Could not update status.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jobService.remove(deleteTarget.id);
      notify('success', 'Job posting deleted.');
      setDeleteTarget(null);
      load();
    } catch {
      notify('error', 'Could not delete job.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Job Postings"
        subtitle={`${jobs.filter((j) => j.status === 'Open').length} open positions`}
        action={<Button icon={<Plus size={18} />} onClick={handleAdd}>Post a Job</Button>}
      />

      <Card className="mb-6">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, department or location..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="All Statuses"
            options={['Open', 'Closed', 'Draft'].map((s) => ({ value: s, label: s }))} className="sm:w-40" />
          {(search || statusFilter) && (
            <button onClick={() => { setSearch(''); setStatusFilter(''); }}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">Clear</button>
          )}
        </CardBody>
      </Card>

      {loading ? (
        <LoadingOverlay />
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={<Briefcase size={28} />} title="No job postings" message="Create a job posting to start recruiting." action={<Button icon={<Plus size={18} />} onClick={handleAdd}>Post a Job</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((j) => (
            <Card key={j.id} hover className="flex flex-col">
              <CardBody className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 leading-tight">{j.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-400">{j.department}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone[j.status]}>{j.status}</Badge>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2"><MapPin size={15} className="text-slate-400" /> {j.location}</div>
                  <div className="flex items-center gap-2"><Calendar size={15} className="text-slate-400" /> {j.experience}</div>
                  <div className="flex items-center gap-2"><IndianRupee size={15} className="text-slate-400" /> {formatCurrencyRange(j.salaryMin, j.salaryMax)}</div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">{applicantCounts[j.id] || 0} applicants · {formatDate(j.postedDate)}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline" icon={<Eye size={15} />} onClick={() => handleView(j)} className="flex-1">View</Button>
                  <Button size="sm" variant="ghost" icon={<Pencil size={15} />} onClick={() => handleEdit(j)}>Edit</Button>
                  <button onClick={() => cycleStatus(j)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="Toggle status"><Briefcase size={15} /></button>
                  <button onClick={() => setDeleteTarget(j)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <JobFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={load} job={editing} />
      <JobDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} job={viewing} onEdit={() => viewing && handleEdit(viewing)} />
      <ConfirmDialog
        open={!!deleteTarget} title="Delete Job Posting"
        message={`Delete "${deleteTarget?.title}"? Applicants in the pipeline will remain but lose their job reference.`}
        onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting}
      />
    </div>
  );
}
