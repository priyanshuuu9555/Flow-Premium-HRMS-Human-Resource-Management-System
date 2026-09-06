import { useState } from 'react';
import { Building2, User, Bell, Palette, Save, Check } from 'lucide-react';
import { Card, CardHeader, CardBody, Input, Button, Avatar, Badge, PageHeader } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { companyInfo as defaultCompany } from '@/data/mockData';
import type { CompanyInfo } from '@/types';

type Tab = 'company' | 'profile' | 'notifications' | 'appearance';

export function SettingsPage() {
  const { notify } = useToast();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('company');
  const [company, setCompany] = useState<CompanyInfo>(defaultCompany);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    leaveAlerts: true, newApplicants: true, attendanceReminders: true, weeklyReports: false, jobExpiry: true,
  });
  const [theme, setTheme] = useState('light');
  const [accent, setAccent] = useState('brand');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'company', label: 'Company', icon: <Building2 size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  ];

  const setCompanyField = (k: keyof CompanyInfo, v: string) => setCompany((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    notify('success', 'Settings saved successfully.');
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your company, profile, and preferences" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar tabs */}
        <Card className="h-fit">
          <div className="p-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <span className={tab === t.id ? 'text-brand-600' : 'text-slate-400'}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {tab === 'company' && (
            <Card>
              <CardHeader title="Company Information" subtitle="Details about your organisation" />
              <CardBody>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Company Name" value={company.name} onChange={(e) => setCompanyField('name', e.target.value)} />
                  <Input label="Legal Name" value={company.legalName} onChange={(e) => setCompanyField('legalName', e.target.value)} />
                  <Input label="Email" value={company.email} onChange={(e) => setCompanyField('email', e.target.value)} />
                  <Input label="Phone" value={company.phone} onChange={(e) => setCompanyField('phone', e.target.value)} />
                  <Input label="Website" value={company.website} onChange={(e) => setCompanyField('website', e.target.value)} />
                  <Input label="GSTIN" value={company.gstin} onChange={(e) => setCompanyField('gstin', e.target.value)} />
                  <div className="sm:col-span-2">
                    <Input label="Address" value={company.address} onChange={(e) => setCompanyField('address', e.target.value)} />
                  </div>
                  <Input label="City" value={company.city} onChange={(e) => setCompanyField('city', e.target.value)} />
                  <Input label="State" value={company.state} onChange={(e) => setCompanyField('state', e.target.value)} />
                  <Input label="ZIP Code" value={company.zip} onChange={(e) => setCompanyField('zip', e.target.value)} />
                  <Input label="Fiscal Year Start" value={company.fiscalYearStart} onChange={(e) => setCompanyField('fiscalYearStart', e.target.value)} />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button icon={<Save size={16} />} onClick={handleSave} loading={saving}>Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {tab === 'profile' && (
            <Card>
              <CardHeader title="User Profile" subtitle="Your personal information" />
              <CardBody>
                <div className="flex items-center gap-4">
                  <Avatar name={user?.name || 'User'} color={user?.avatarColor || '#6366f1'} size="lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user?.name}</h3>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                    <div className="mt-1"><Badge tone="brand">{user?.role}</Badge></div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Full Name" defaultValue={user?.name} />
                  <Input label="Email" defaultValue={user?.email} />
                  <Input label="Role" defaultValue={user?.role} disabled />
                  <Input label="Phone" defaultValue="+91 98765 43210" />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button icon={<Save size={16} />} onClick={handleSave} loading={saving}>Update Profile</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <CardHeader title="Notification Preferences" subtitle="Choose what alerts you receive" />
              <CardBody>
                <div className="space-y-1">
                  {[
                    { key: 'leaveAlerts' as const, label: 'Leave Request Alerts', desc: 'Get notified when an employee applies for leave' },
                    { key: 'newApplicants' as const, label: 'New Applicant Notifications', desc: 'Alerts when someone applies for a job posting' },
                    { key: 'attendanceReminders' as const, label: 'Attendance Reminders', desc: 'Daily summary of attendance and absences' },
                    { key: 'weeklyReports' as const, label: 'Weekly HR Reports', desc: 'Comprehensive weekly summary every Monday' },
                    { key: 'jobExpiry' as const, label: 'Job Expiry Notices', desc: 'Alert when a job posting is about to expire' },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 hover:bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{n.label}</p>
                        <p className="text-xs text-slate-400">{n.desc}</p>
                      </div>
                      <button onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))}
                        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${notifications[n.key] ? 'bg-brand-600' : 'bg-slate-300'}`}>
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[n.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button icon={<Save size={16} />} onClick={handleSave} loading={saving}>Save Preferences</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {tab === 'appearance' && (
            <Card>
              <CardHeader title="Appearance" subtitle="Customise the look and feel" />
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Theme</p>
                    <p className="mt-0.5 text-xs text-slate-400">Select your preferred colour scheme</p>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {['light', 'dark', 'auto'].map((t) => (
                        <button key={t} onClick={() => setTheme(t)}
                          className={`rounded-xl border-2 p-4 text-center transition-all ${theme === t ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <div className={`mx-auto h-8 w-8 rounded-full ${t === 'light' ? 'bg-white border' : t === 'dark' ? 'bg-slate-800' : 'bg-gradient-to-br from-white to-slate-800'}`} />
                          <p className="mt-2 text-sm font-medium capitalize text-slate-700">{t}</p>
                          {theme === t && <Check size={14} className="mx-auto mt-1 text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Accent Colour</p>
                    <p className="mt-0.5 text-xs text-slate-400">Used for buttons, links, and highlights</p>
                    <div className="mt-3 flex gap-3">
                      {[
                        { id: 'brand', color: '#4f46e5' }, { id: 'blue', color: '#0ea5e9' },
                        { id: 'green', color: '#10b981' }, { id: 'amber', color: '#f59e0b' },
                        { id: 'pink', color: '#ec4899' },
                      ].map((c) => (
                        <button key={c.id} onClick={() => setAccent(c.id)}
                          className={`h-10 w-10 rounded-full ring-2 ring-offset-2 transition-all ${accent === c.id ? 'ring-slate-400 scale-110' : 'ring-transparent'}`}
                          style={{ backgroundColor: c.color }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button icon={<Save size={16} />} onClick={handleSave} loading={saving}>Apply</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
