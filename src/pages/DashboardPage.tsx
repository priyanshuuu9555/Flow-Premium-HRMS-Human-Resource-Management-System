import { useEffect, useState } from 'react';
import {
  Users, UserCheck, CalendarOff, Briefcase, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, UserPlus, Activity,
} from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Avatar, LoadingOverlay } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/Charts';
import { employeeService } from '@/services/employeeService';
import { attendanceService } from '@/services/attendanceService';
import { leaveService } from '@/services/leaveService';
import { jobService } from '@/services/jobService';
import { recruitmentService } from '@/services/recruitmentService';
import { useRouter } from '@/hooks/useRouter';
import { formatCurrency, formatDate, relativeTime } from '@/utils';
import type { Employee, LeaveRequest, Applicant } from '@/types';

const deptColors: Record<string, string> = {
  Engineering: '#6366f1', HR: '#0ea5e9', Marketing: '#f59e0b',
  Finance: '#10b981', Design: '#ec4899', Operations: '#14b8a6',
};

export function DashboardPage() {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [stats, setStats] = useState({ total: 0, present: 0, onLeave: 0, openJobs: 0, attendancePct: 0 });

  useEffect(() => {
    (async () => {
      const emp = employeeService.snapshot();
      const att = attendanceService.snapshot();
      const lv = leaveService.snapshot();
      const jobs = jobService.snapshot();
      const apps = recruitmentService.snapshot();
      setEmployees(emp);
      setLeaves(lv);
      setApplicants(apps);

      const todayAtt = att.filter((a) => a.date === att[0]?.date);
      const present = todayAtt.filter((a) => a.status === 'Present' || a.status === 'Late').length;
      const onLeave = emp.filter((e) => e.status === 'On Leave').length;
      const openJobs = jobs.filter((j) => j.status === 'Open').length;
      const attPct = todayAtt.length ? Math.round((present / todayAtt.length) * 100) : 0;
      setStats({ total: emp.length, present, onLeave, openJobs, attendancePct: attPct });
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingOverlay />;

  const recentEmployees = [...employees].sort((a, b) => b.joiningDate.localeCompare(a.joiningDate)).slice(0, 5);
  const recentLeaves = [...leaves].sort((a, b) => b.appliedOn.localeCompare(a.appliedOn)).slice(0, 4);
  const recentApplicants = [...applicants].sort((a, b) => b.appliedOn.localeCompare(a.appliedOn)).slice(0, 4);

  const deptData = Object.entries(
    employees.reduce<Record<string, number>>((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + 1;
      return acc;
    }, {}),
  ).map(([label, value]) => ({ label, value, color: deptColors[label] || '#94a3b8' }));

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const attChart = weekDays.map((label, i) => ({
    label,
    value: [22, 24, 23, 25, 21, 18, 5][i] || 0,
  }));

  const statCards = [
    { label: 'Total Employees', value: stats.total, icon: <Users size={20} />, color: 'bg-brand-50 text-brand-600', trend: '+3 this month', up: true },
    { label: 'Present Today', value: stats.present, icon: <UserCheck size={20} />, color: 'bg-emerald-50 text-emerald-600', trend: `${stats.attendancePct}% attendance`, up: true },
    { label: 'On Leave', value: stats.onLeave, icon: <CalendarOff size={20} />, color: 'bg-amber-50 text-amber-600', trend: '2 returning soon', up: false },
    { label: 'Open Positions', value: stats.openJobs, icon: <Briefcase size={20} />, color: 'bg-sky-50 text-sky-600', trend: '12 applicants', up: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back — here’s what’s happening at KIMO today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} hover>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              <p className="mt-2 text-xs text-slate-400">{s.trend}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Weekly Attendance" subtitle="Present employees over the last 7 days" action={<Badge tone="green"><TrendingUp size={12} /> {stats.attendancePct}%</Badge>} />
          <CardBody>
            <BarChart data={attChart} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Department Distribution" subtitle="Headcount by department" />
          <CardBody>
            <DonutChart data={deptData} />
          </CardBody>
        </Card>
      </div>

      {/* Activity lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent employees */}
        <Card className="lg:col-span-1">
          <CardHeader title="Recent Employees" subtitle="Latest joiners" action={
            <button onClick={() => navigate('employees')} className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</button>
          } />
          <div className="divide-y divide-slate-50">
            {recentEmployees.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50">
                <Avatar name={e.name} color={e.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{e.name}</p>
                  <p className="truncate text-xs text-slate-400">{e.designation} · {e.department}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <UserPlus size={12} /> {relativeTime(e.joiningDate)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent leave requests */}
        <Card className="lg:col-span-1">
          <CardHeader title="Leave Requests" subtitle="Recent applications" action={
            <button onClick={() => navigate('leave')} className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</button>
          } />
          <div className="divide-y divide-slate-50">
            {recentLeaves.map((l) => (
              <div key={l.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <CalendarOff size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{l.employeeName}</p>
                  <p className="truncate text-xs text-slate-400">{l.leaveType} · {l.days} day{l.days > 1 ? 's' : ''}</p>
                </div>
                <Badge tone={l.status === 'Approved' ? 'green' : l.status === 'Rejected' ? 'red' : 'amber'}>{l.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recruitment activity */}
        <Card className="lg:col-span-1">
          <CardHeader title="Recruitment Activity" subtitle="Latest applicants" action={
            <button onClick={() => navigate('recruitment')} className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</button>
          } />
          <div className="divide-y divide-slate-50">
            {recentApplicants.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <Activity size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{a.name}</p>
                  <p className="truncate text-xs text-slate-400">{a.jobTitle}</p>
                </div>
                <Badge tone="blue">{a.stage}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick stats footer */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Avg. Salary', value: formatCurrency(Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length)), icon: <Briefcase size={16} /> },
          { label: 'Pending Leaves', value: leaves.filter((l) => l.status === 'Pending').length, icon: <Clock size={16} /> },
          { label: 'Total Applicants', value: applicants.length, icon: <Users size={16} /> },
          { label: 'Active Jobs', value: jobService.snapshot().filter((j) => j.status === 'Open').length, icon: <Briefcase size={16} /> },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">{s.icon}</div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
