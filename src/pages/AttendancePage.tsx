
import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  CalendarOff,
} from 'lucide-react';

import {
  Card,
  CardBody,
  Badge,
  Avatar,
  Input,
  Select,
  PageHeader,
  EmptyState,
  LoadingOverlay,
} from '@/components/ui';

import { attendanceService } from '@/services/attendanceService';
import { employeeService } from '@/services/employeeService';
import { formatDate } from '@/utils';

import type {
  AttendanceRecord,
  AttendanceStatus,
} from '@/types';

const statusTone: Record<
  AttendanceStatus,
  'green' | 'red' | 'amber' | 'blue' | 'slate'
> = {
  Present: 'green',
  Absent: 'red',
  Late: 'amber',
  'Half Day': 'blue',
  Leave: 'slate',
};

export function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [empMap, setEmpMap] = useState<Map<string, string>>(new Map());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Load attendance and employee data from Django
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [attendanceData, employeeData] = await Promise.all([
          attendanceService.getAll(),
          employeeService.getAll(),
        ]);

        if (!mounted) return;

        setRecords(attendanceData);

        const colorMap = new Map<string, string>();

        employeeData.forEach((employee) => {
          colorMap.set(employee.id, employee.avatarColor);
        });

        setEmpMap(colorMap);
      } catch (err) {
        console.error('Attendance loading error:', err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load attendance records.'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // Available dates
  const dates = useMemo(
    () =>
      [...new Set(records.map((record) => record.date))]
        .sort()
        .reverse(),
    [records]
  );

  // Search and filters
  const filtered = useMemo(() => {
    return records.filter((record) => {
      const query = search.toLowerCase();

      const matchSearch =
        !query ||
        record.employeeName.toLowerCase().includes(query) ||
        record.employeeId.toLowerCase().includes(query);

      const matchDate =
        !dateFilter || record.date === dateFilter;

      const matchStatus =
        !statusFilter || record.status === statusFilter;

      return matchSearch && matchDate && matchStatus;
    });
  }, [records, search, dateFilter, statusFilter]);

  // Latest attendance date
  const todayDate = dates[0] || '';

  const todayRecords = records.filter(
    (record) => record.date === todayDate
  );

  const present = todayRecords.filter(
    (record) => record.status === 'Present'
  ).length;

  const absent = todayRecords.filter(
    (record) => record.status === 'Absent'
  ).length;

  const late = todayRecords.filter(
    (record) => record.status === 'Late'
  ).length;

  const onLeave = todayRecords.filter(
    (record) => record.status === 'Leave'
  ).length;

  const attPct = todayRecords.length
    ? Math.round(
        ((present + late) / todayRecords.length) * 100
      )
    : 0;

  const summaryCards = [
    {
      label: 'Attendance Rate',
      value: `${attPct}%`,
      icon: <CalendarCheck size={20} />,
      color: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Present',
      value: present,
      icon: <UserCheck size={20} />,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Absent',
      value: absent,
      icon: <UserX size={20} />,
      color: 'bg-red-50 text-red-600',
    },
    {
      label: 'Late Arrivals',
      value: late,
      icon: <Clock size={20} />,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle={`Daily attendance records — ${
          todayDate ? formatDate(todayDate) : 'No records yet'
        }`}
      />

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.label} hover>
            <CardBody>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
              >
                {item.icon}
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {item.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {item.label}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by employee name or ID..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <Input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="sm:w-44"
          />

          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            placeholder="All Statuses"
            options={[
              'Present',
              'Absent',
              'Late',
              'Half Day',
              'Leave',
            ].map((status) => ({
              value: status,
              label: status,
            }))}
            className="sm:w-40"
          />

          {(search || dateFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setDateFilter('');
                setStatusFilter('');
              }}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Clear
            </button>
          )}
        </CardBody>
      </Card>

      {/* Loading */}
      {loading ? (
        <LoadingOverlay />

      ) : error ? (
        <Card>
          <CardBody>
            <p className="text-sm text-red-600">{error}</p>
          </CardBody>
        </Card>

      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarOff size={28} />}
            title="No attendance records"
            message="No records match your filters. Attendance records will appear here once added."
          />
        </Card>

      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">
                    Employee
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Check In
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Check Out
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Hours
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.slice(0, 100).map((record) => (
                  <tr
                    key={record.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={record.employeeName}
                          color={
                            empMap.get(record.employeeId) || '#94a3b8'
                          }
                          size="sm"
                        />

                        <div>
                          <p className="font-medium text-slate-900">
                            {record.employeeName}
                          </p>

                          <p className="text-xs text-slate-400">
                            {record.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(record.date)}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {record.checkIn || '—'}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {record.checkOut || '—'}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-700">
                      {record.workingHours}
                    </td>

                    <td className="px-4 py-3">
                      <Badge tone={statusTone[record.status]}>
                        {record.status}
                      </Badge>
                    </td>
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
