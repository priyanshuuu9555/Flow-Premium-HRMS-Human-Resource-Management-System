
import { useEffect, useState } from 'react';

import {
  Users,
  UserCheck,
  CalendarOff,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  UserPlus,
  Activity,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Avatar,
  LoadingOverlay,
} from '@/components/ui';

import { BarChart, DonutChart } from '@/components/Charts';

import { employeeService } from '@/services/employeeService';
import { attendanceService } from '@/services/attendanceService';
import { leaveService } from '@/services/leaveService';
import { jobService } from '@/services/jobService';
import { recruitmentService } from '@/services/recruitmentService';

import { useRouter } from '@/hooks/useRouter';
import { formatCurrency, relativeTime } from '@/utils';

import type {
  Employee,
  LeaveRequest,
  Applicant,
} from '@/types';

const deptColors: Record<string, string> = {
  Engineering: '#6366f1',
  HR: '#0ea5e9',
  Marketing: '#f59e0b',
  Finance: '#10b981',
  Design: '#ec4899',
  Operations: '#14b8a6',
};

export function DashboardPage() {
  const { navigate } = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    onLeave: 0,
    openJobs: 0,
    attendancePct: 0,
  });

  const [activeJobs, setActiveJobs] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch database records from Django
        const [
          emp,
          att,
          lv,
        ] = await Promise.all([
          employeeService.getAll(),
          attendanceService.getAll(),
          leaveService.getAll(),
        ]);

        // These two modules still use their existing mock stores
        const jobs = jobService.snapshot();
        const apps = recruitmentService.snapshot();

        if (cancelled) return;

        const employeeList = Array.isArray(emp) ? emp : [];
        const attendanceList = Array.isArray(att) ? att : [];
        const leaveList = Array.isArray(lv) ? lv : [];
        const jobList = Array.isArray(jobs) ? jobs : [];
        const applicantList = Array.isArray(apps) ? apps : [];

        setEmployees(employeeList);
        setLeaves(leaveList);
        setApplicants(applicantList);

        // Find the latest date with attendance records
        const latestDate = attendanceList.length
          ? attendanceList.reduce(
              (latest, item) =>
                item.date > latest ? item.date : latest,
              attendanceList[0].date
            )
          : '';

        const todayAtt = attendanceList.filter(
          (item) => item.date === latestDate
        );

        const present = todayAtt.filter(
          (item) =>
            item.status === 'Present' ||
            item.status === 'Late'
        ).length;

        // Employee calculations
        const onLeave = employeeList.filter(
          (employee) => employee.status === 'On Leave'
        ).length;

        // Job calculations
        const openJobs = jobList.filter(
          (job) => job.status === 'Open'
        ).length;

        const attendancePct = todayAtt.length
          ? Math.round(
              (present / todayAtt.length) * 100
            )
          : 0;

        setActiveJobs(openJobs);

        setStats({
          total: employeeList.length,
          present,
          onLeave,
          openJobs,
          attendancePct,
        });

      } catch (err) {
        console.error('Dashboard loading failed:', err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load dashboard data.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingOverlay />;
  }

  // Recent employees
  const recentEmployees = [...employees]
    .sort((a, b) =>
      (b.joiningDate || '').localeCompare(a.joiningDate || '')
    )
    .slice(0, 5);

  // Recent leave requests
  const recentLeaves = [...leaves]
    .sort((a, b) =>
      (b.appliedOn || '').localeCompare(a.appliedOn || '')
    )
    .slice(0, 4);

  // Recent applicants
  const recentApplicants = [...applicants]
    .sort((a, b) =>
      (b.appliedOn || '').localeCompare(a.appliedOn || '')
    )
    .slice(0, 4);

  // Department distribution
  const deptData = Object.entries(
    employees.reduce<Record<string, number>>((acc, employee) => {
      acc[employee.department] =
        (acc[employee.department] || 0) + 1;

      return acc;
    }, {})
  ).map(([label, value]) => ({
    label,
    value,
    color: deptColors[label] || '#94a3b8',
  }));

  // Weekly attendance chart
  // Currently sample chart data
  const weekDays = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  const attChart = weekDays.map((label, index) => ({
    label,
    value: [22, 24, 23, 25, 21, 18, 5][index],
  }));

  // Average salary
  const averageSalary = employees.length
    ? Math.round(
        employees.reduce(
          (sum, employee) =>
            sum + Number(employee.salary || 0),
          0
        ) / employees.length
      )
    : 0;

  // Dashboard cards
  const statCards = [
    {
      label: 'Total Employees',
      value: stats.total,
      icon: <Users size={20} />,
      color: 'bg-brand-50 text-brand-600',
      trend: '+3 this month',
      up: true,
    },
    {
      label: 'Present Today',
      value: stats.present,
      icon: <UserCheck size={20} />,
      color: 'bg-emerald-50 text-emerald-600',
      trend: `${stats.attendancePct}% attendance`,
      up: true,
    },
    {
      label: 'On Leave',
      value: stats.onLeave,
      icon: <CalendarOff size={20} />,
      color: 'bg-amber-50 text-amber-600',
      trend: 'Current employees',
      up: false,
    },
    {
      label: 'Open Positions',
      value: stats.openJobs,
      icon: <Briefcase size={20} />,
      color: 'bg-sky-50 text-sky-600',
      trend: `${applicants.length} applicants`,
      up: true,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back — here's what's happening at KIMO today.
        </p>
      </div>

      {/* API error message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            Dashboard data could not be fully loaded.
          </p>

          <p className="mt-1">{error}</p>

          <p className="mt-1">
            Check that your Django backend is running.
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} hover>
            <CardBody>
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  {stat.icon}
                </div>

                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.up
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  {stat.up ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                </span>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {stat.label}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {stat.trend}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <Card className="lg:col-span-2">
          <CardHeader
            title="Weekly Attendance"
            subtitle="Present employees over the last 7 days"
            action={
              <Badge tone="green">
                <TrendingUp size={12} />
                {stats.attendancePct}%
              </Badge>
            }
          />

          <CardBody>
            <BarChart data={attChart} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Department Distribution"
            subtitle="Headcount by department"
          />

          <CardBody>
            <DonutChart data={deptData} />
          </CardBody>
        </Card>

      </div>

      {/* Activity lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent employees */}
        <Card>
          <CardHeader
            title="Recent Employees"
            subtitle="Latest joiners"
            action={
              <button
                onClick={() => navigate('employees')}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View all
              </button>
            }
          />

          <div className="divide-y divide-slate-50">
            {recentEmployees.length ? (
              recentEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50"
                >
                  <Avatar
                    name={employee.name}
                    color={employee.avatarColor}
                    size="sm"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {employee.name}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {employee.designation} · {employee.department}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <UserPlus size={12} />

                    {employee.joiningDate
                      ? relativeTime(employee.joiningDate)
                      : 'N/A'}
                  </div>
                </div>
              ))
            ) : (
              <p className="px-6 py-8 text-center text-sm text-slate-400">
                No employees found.
              </p>
            )}
          </div>
        </Card>

        {/* Recent leave requests */}
        <Card>
          <CardHeader
            title="Leave Requests"
            subtitle="Recent applications"
            action={
              <button
                onClick={() => navigate('leave')}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View all
              </button>
            }
          />

          <div className="divide-y divide-slate-50">
            {recentLeaves.length ? (
              recentLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <CalendarOff size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {leave.employeeName}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {leave.leaveType} · {leave.days} day
                      {leave.days > 1 ? 's' : ''}
                    </p>
                  </div>

                  <Badge
                    tone={
                      leave.status === 'Approved'
                        ? 'green'
                        : leave.status === 'Rejected'
                          ? 'red'
                          : 'amber'
                    }
                  >
                    {leave.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="px-6 py-8 text-center text-sm text-slate-400">
                No leave requests found.
              </p>
            )}
          </div>
        </Card>

        {/* Recruitment activity */}
        <Card>
          <CardHeader
            title="Recruitment Activity"
            subtitle="Latest applicants"
            action={
              <button
                onClick={() => navigate('recruitment')}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View all
              </button>
            }
          />

          <div className="divide-y divide-slate-50">
            {recentApplicants.length ? (
              recentApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <Activity size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {applicant.name}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {applicant.jobTitle}
                    </p>
                  </div>

                  <Badge tone="blue">
                    {applicant.stage}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="px-6 py-8 text-center text-sm text-slate-400">
                No applicants found.
              </p>
            )}
          </div>
        </Card>

      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {[
          {
            label: 'Avg. Salary',
            value: formatCurrency(averageSalary),
            icon: <Briefcase size={16} />,
          },
          {
            label: 'Pending Leaves',
            value: leaves.filter(
              (leave) => leave.status === 'Pending'
            ).length,
            icon: <Clock size={16} />,
          },
          {
            label: 'Total Applicants',
            value: applicants.length,
            icon: <Users size={16} />,
          },
          {
            label: 'Active Jobs',
            value: activeJobs,
            icon: <Briefcase size={16} />,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardBody className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                {stat.icon}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {stat.value}
                </p>

                <p className="text-xs text-slate-400">
                  {stat.label}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}

      </div>

    </div>
  );
}
