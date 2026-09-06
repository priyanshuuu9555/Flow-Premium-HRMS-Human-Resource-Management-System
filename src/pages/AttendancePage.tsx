import { useEffect, useState, useMemo } from 'react';
import { Search, CalendarCheck, UserCheck, UserX, Clock, CalendarOff } from 'lucide-react';
import { Card, CardBody, Badge, Avatar, Input, Select, PageHeader, EmptyState, LoadingOverlay } from '@/components/ui';
import { attendanceService } from '@/services/attendanceService';
import { employeeService } from '@/services/employeeService';
import { formatDate } from '@/utils';
import type { AttendanceRecord, AttendanceStatus } from '@/types';

const statusTone: Record<AttendanceStatus, 'green' | 'red' | 'amber' | 'blue' | 'slate'> = {
  Present: 'green', Absent: 'red', Late: 'amber', 'Half Day': 'blue', Leave: 'slate',
};

export function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    (async () => {
      const data = await attendanceService.getAll();
      setRecords(data);
      setLoading(false);
    })();
  }, []);

  const dates = useMemo(() => [...new Set(records.map((r) => r.date))].sort().reverse(), [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.employeeName.toLowerCase().includes(q) || r.employeeId.toLowerCase().includes(q);
      const matchDate = !dateFilter || r.date === dateFilter;
      const matchStatus = !statusFilter || r.status === statusFilter;
      return matchSearch && matchDate && matchStatus;
    });
  }, [records, search, dateFilter, statusFilter]);

  const todayDate = dates[0] || '';
  const todayRecords = records.filter((r) => r.date === todayDate);
  const present = todayRecords.filter((r) => r.status === 'Present').length;
  const absent = todayRecords.filter((r) => r.status === 'Absent').length;
  const late = todayRecords.filter((r) => r.status === 'Late').length;
  const onLeave = todayRecords.filter((r) => r.status === 'Leave').length;
  const attPct = todayRecords.length ? Math.round(((present + late) / todayRecords.length) * 100) : 0;

  const empMap = useMemo(() => {
    const m = new Map<string, string>();
    employeeService.snapshot().forEach((e) => m.set(e.id, e.avatarColor));
    return m;
  }, []);

  const summaryCards = [
    { label: 'Attendance Rate', value: `${attPct}%`, icon: <CalendarCheck size={20} />, color: 'bg-brand-50 text-brand-600' },
    { label: 'Present', value: present, icon: <UserCheck size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Absent', value: absent, icon: <UserX size={20} />, color: 'bg-red-50 text-red-600' },
    { label: 'Late Arrivals', value: late, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div>
      <PageHeader title="Attendance" subtitle={`Daily attendance records — ${formatDate(todayDate)}`} />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((s) => (
          <Card key={s.label} hover>
            <CardBody>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee name or ID..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
          </div>
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="sm:w-44" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="All Statuses"
            options={['Present', 'Absent', 'Late', 'Half Day', 'Leave'].map((s) => ({ value: s, label: s }))} className="sm:w-40" />
          {(search || dateFilter || statusFilter) && (
            <button onClick={() => { setSearch(''); setDateFilter(''); setStatusFilter(''); }}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">Clear</button>
          )}
        </CardBody>
      </Card>

      {loading ? (
        <LoadingOverlay />
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={<CalendarOff size={28} />} title="No attendance records" message="No records match your filters. Try changing the date or search." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">Employee</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Check In</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Check Out</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Hours</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.slice(0, 100).map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.employeeName} color={empMap.get(r.employeeId) || '#94a3b8'} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{r.employeeName}</p>
                          <p className="text-xs text-slate-400">{r.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(r.date)}</td>
                    <td className="px-4 py-3 text-slate-600">{r.checkIn || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{r.checkOut || '—'}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{r.workingHours}</td>
                    <td className="px-4 py-3"><Badge tone={statusTone[r.status]}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
            Showing {Math.min(filtered.length, 100)} of {filtered.length} records
          </div>
        </Card>
      )}
    </div>
  );
}
