import { useEffect, useState, useMemo } from 'react';
import { UserRoundSearch, Users, ChevronRight, Mail, Phone, Briefcase } from 'lucide-react';
import { Card, CardBody, Badge, Avatar, PageHeader, EmptyState, LoadingOverlay, Modal, Select } from '@/components/ui';
import { recruitmentService } from '@/services/recruitmentService';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/utils';
import type { Applicant, RecruitmentStage } from '@/types';

const stages: RecruitmentStage[] = ['Applied', 'Screening', 'Interview', 'Shortlisted', 'Selected'];

const stageTone: Record<RecruitmentStage, 'slate' | 'blue' | 'amber' | 'brand' | 'green'> = {
  Applied: 'slate', Screening: 'blue', Interview: 'amber', Shortlisted: 'brand', Selected: 'green',
};

const stageColors: Record<RecruitmentStage, string> = {
  Applied: 'bg-slate-100 text-slate-600 border-slate-200',
  Screening: 'bg-sky-50 text-sky-600 border-sky-200',
  Interview: 'bg-amber-50 text-amber-600 border-amber-200',
  Shortlisted: 'bg-brand-50 text-brand-600 border-brand-200',
  Selected: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

const avatarColors = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function RecruitmentPage() {
  const { notify } = useToast();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [moving, setMoving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await recruitmentService.getAll();
    setApplicants(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Group by stage
  const byStage = useMemo(() => {
    const map: Record<RecruitmentStage, Applicant[]> = { Applied: [], Screening: [], Interview: [], Shortlisted: [], Selected: [] };
    applicants.forEach((a) => map[a.stage].push(a));
    return map;
  }, [applicants]);

  // Pipeline summary per job
  const jobSummary = useMemo(() => {
    const map: Record<string, { title: string; department: string; counts: Record<RecruitmentStage, number>; total: number; selected: number; interviewed: number }> = {};
    applicants.forEach((a) => {
      if (!map[a.jobId]) {
        map[a.jobId] = { title: a.jobTitle, department: a.department, counts: { Applied: 0, Screening: 0, Interview: 0, Shortlisted: 0, Selected: 0 }, total: 0, selected: 0, interviewed: 0 };
      }
      map[a.jobId].counts[a.stage]++;
      map[a.jobId].total++;
      if (a.stage === 'Selected') map[a.jobId].selected++;
      if (a.stage === 'Interview' || a.stage === 'Shortlisted' || a.stage === 'Selected') map[a.jobId].interviewed++;
    });
    return Object.entries(map);
  }, [applicants]);

  const moveStage = async (applicant: Applicant, newStage: RecruitmentStage) => {
    setMoving(true);
    try {
      await recruitmentService.update(applicant.id, { stage: newStage });
      notify('success', `${applicant.name} moved to ${newStage}.`);
      setSelected(null);
      load();
    } catch {
      notify('error', 'Could not update stage.');
    } finally {
      setMoving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Recruitment Pipeline" subtitle="Track candidates through every hiring stage" />

      {/* Pipeline summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stages.map((s) => (
          <Card key={s} hover>
            <CardBody>
              <div className={`mb-3 inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${stageColors[s]}`}>{s}</div>
              <p className="text-3xl font-bold text-slate-900">{byStage[s].length}</p>
              <p className="mt-1 text-xs text-slate-400">candidates</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Job-level pipeline table */}
      <Card className="mb-6 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-900">Jobs Overview</h3>
          <p className="mt-0.5 text-sm text-slate-500">Applicant breakdown by job posting</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 font-semibold text-slate-600">Job Title</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Department</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Applicants</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Interviewed</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Shortlisted</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Selected</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobSummary.map(([id, j]) => (
                <tr key={id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{j.title}</td>
                  <td className="px-4 py-3 text-slate-600">{j.department}</td>
                  <td className="px-4 py-3 text-slate-700">{j.total}</td>
                  <td className="px-4 py-3 text-slate-700">{j.interviewed}</td>
                  <td className="px-4 py-3 text-slate-700">{j.counts.Shortlisted}</td>
                  <td className="px-4 py-3 text-slate-700">{j.selected}</td>
                  <td className="px-4 py-3">
                    {j.selected > 0 ? <Badge tone="green">Hiring</Badge> : <Badge tone="blue">Active</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Kanban-style board */}
      {loading ? (
        <LoadingOverlay />
      ) : applicants.length === 0 ? (
        <Card><EmptyState icon={<UserRoundSearch size={28} />} title="No applicants yet" message="Job postings will attract candidates soon." /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage) => (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5 border border-slate-200">
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${stageColors[stage]}`}>{stage}</span>
                <span className="text-sm font-semibold text-slate-400">{byStage[stage].length}</span>
              </div>
              <div className="space-y-2.5">
                {byStage[stage].map((a, i) => (
                  <button key={a.id} onClick={() => setSelected(a)}
                    className="block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-all hover:shadow-card-hover hover:border-brand-200">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={a.name} color={avatarColors[i % avatarColors.length]} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{a.name}</p>
                        <p className="truncate text-xs text-slate-400">{a.jobTitle}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{a.experience} yrs exp</span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  </button>
                ))}
                {byStage[stage].length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">No candidates</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant detail + move stage */}
      <Modal
        open={!!selected} onClose={() => setSelected(null)} title="Applicant Details"
        subtitle={selected?.jobTitle} size="md"
        footer={
          <>
            <Select
              value={selected?.stage || ''}
              onChange={(e) => selected && moveStage(selected, e.target.value as RecruitmentStage)}
              options={stages.map((s) => ({ value: s, label: `Move to ${s}` }))}
              placeholder="Change stage..."
              className="flex-1"
            />
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} color={avatarColors[selected.id.charCodeAt(4) % avatarColors.length]} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.jobTitle} · {selected.department}</p>
                <div className="mt-2"><Badge tone={stageTone[selected.stage]}>{selected.stage}</Badge></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Mail size={18} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selected.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Phone size={18} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selected.phone}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Briefcase size={18} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selected.experience} years experience</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Users size={18} className="text-slate-400" />
                <span className="text-sm text-slate-700">Applied {formatDate(selected.appliedOn)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {stages.map((s) => (
                <button key={s} disabled={moving}
                  onClick={() => moveStage(selected, s)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${selected.stage === s ? stageColors[s] : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
