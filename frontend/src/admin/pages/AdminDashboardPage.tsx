import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminApiError, getAnalyticsOverview, getDashboardSummary, type AnalyticsOverview, type DashboardSummary } from '../../services/admin-api';

const statusLabels: Record<string, string> = {
  NEW: 'ใหม่',
  CONTACTED: 'ติดต่อแล้ว',
  FOLLOW_UP: 'ติดตามต่อ',
  COMPLETED: 'ปิดงานแล้ว',
  CANCELLED: 'ยกเลิก',
};

const emailLabels: Record<string, string> = {
  PENDING: 'รอส่ง',
  SENT: 'ส่งสำเร็จ',
  FAILED: 'ส่งล้มเหลว',
};

export const AdminDashboardPage = (): JSX.Element => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [leadSummary, analyticsSummary] = await Promise.all([
        getDashboardSummary(),
        getAnalyticsOverview({ from: new Date().toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10) }),
      ]);
      setSummary(leadSummary);
      setAnalytics(analyticsSummary);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <div className="rounded-lg bg-white p-6 font-bold shadow-sm">กำลังโหลด Dashboard...</div>;
  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!summary) return <EmptyBox />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-950">แดชบอร์ดภาพรวม</h1>
        <p className="text-sm font-semibold text-gray-500">สรุปงานติดต่อ ลูกค้า และสัญญาณสำคัญจากเว็บไซต์</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="ผู้ติดต่อทั้งหมด" value={summary.totalLeads} hint="สะสมทั้งหมด" />
        <Metric label="ผู้ติดต่อใหม่" value={summary.newLeads} hint={summary.newLeads ? 'ควรรีบติดต่อกลับ' : 'ไม่มีค้างใหม่'} tone={summary.newLeads ? 'warn' : 'ok'} />
        <Metric label="ติดต่อวันนี้" value={summary.todayLeads} hint="จากฟอร์มเว็บไซต์" />
        <Metric label="ติดต่อเดือนนี้" value={summary.thisMonthLeads} hint={`สัปดาห์นี้ ${summary.thisWeekLeads} ราย`} />
        <Metric label="อีเมลสำเร็จ" value={summary.emailSent} hint="Resend ส่งสำเร็จ" tone="ok" />
        <Metric label="อีเมลล้มเหลว" value={summary.emailFailed} hint={summary.emailFailed ? 'ควรตรวจระบบอีเมล' : 'ปกติ'} tone={summary.emailFailed ? 'bad' : 'ok'} />
        <Metric label="เข้าชมวันนี้" value={analytics?.pageViews ?? 0} hint={`${analytics?.sessions ?? 0} เซสชัน`} />
        <Metric label="Conversion วันนี้" value={`${analytics?.conversionRate ?? 0}%`} hint="ส่งฟอร์มสำเร็จ / เซสชัน" />
      </div>
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-black text-gray-950">Pipeline ผู้ติดต่อ</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ['NEW', summary.newLeads],
            ['CONTACTED', summary.contactedLeads],
            ['FOLLOW_UP', summary.followUpLeads],
            ['COMPLETED', summary.completedLeads],
            ['CANCELLED', summary.cancelledLeads],
          ].map(([status, count]) => <Metric key={status} label={statusLabels[String(status)]} value={count} hint={`${percentage(Number(count), summary.totalLeads)}% ของทั้งหมด`} compact />)}
        </div>
      </section>
      <div className="rounded-lg border border-green-100 bg-green-50 p-5">
        <h2 className="text-lg font-black text-green-950">ข้อสังเกตจากข้อมูล</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-green-900">
          {buildDashboardInsights(summary, analytics).map(item => <li key={item}>• {item}</li>)}
        </ul>
      </div>
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-950">ผู้ติดต่อเข้าล่าสุด</h2>
          <Link to="/admin/leads" className="text-sm font-bold text-green-700 hover:text-green-900">ดูทั้งหมด</Link>
        </div>
        {summary.recentLeads.length === 0 ? <EmptyBox /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr><th className="py-2">ชื่อ</th><th>เบอร์โทร</th><th>หัวข้อ</th><th>สถานะ</th><th>อีเมล</th><th>วันที่</th><th></th></tr>
              </thead>
              <tbody>
                {summary.recentLeads.map(lead => (
                  <tr key={lead.id} className="border-t border-gray-100">
                    <td className="py-3 font-bold">{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.topic ?? '-'}</td>
                    <td><StatusBadge value={lead.status} /></td>
                    <td><EmailBadge value={lead.emailDeliveryStatus} /></td>
                    <td>{formatDate(lead.createdAt)}</td>
                    <td><Link className="font-bold text-green-700" to={`/admin/leads/${lead.id}`}>รายละเอียด</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export const StatusBadge = ({ value }: { value: string }): JSX.Element => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${value === 'NEW' ? 'bg-blue-50 text-blue-700' : value === 'FOLLOW_UP' ? 'bg-yellow-50 text-yellow-700' : value === 'COMPLETED' ? 'bg-green-50 text-green-700' : value === 'CANCELLED' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{statusLabels[value] ?? value}</span>
);

export const EmailBadge = ({ value }: { value: string }): JSX.Element => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${value === 'SENT' ? 'bg-green-50 text-green-700' : value === 'FAILED' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{emailLabels[value] ?? value}</span>
);

export const formatDate = (value: string): string => {
  const normalized = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('th-TH');
};

export const ErrorBox = ({ message, onRetry }: { message: string; onRetry: () => void }): JSX.Element => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <p className="font-bold text-red-700">{message}</p>
    <button onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"><RefreshCw className="h-4 w-4" /> ลองใหม่</button>
  </div>
);

export const EmptyBox = (): JSX.Element => <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm font-bold text-gray-500">ยังไม่มีข้อมูล</div>;

const percentage = (value: number, total: number): number => total ? Math.round((value / total) * 100) : 0;

const Metric = ({ label, value, hint, tone, compact }: { label: string; value: string | number; hint: string; tone?: 'ok' | 'bad' | 'warn'; compact?: boolean }): JSX.Element => (
  <div className={`rounded-lg border p-4 shadow-sm ${tone === 'bad' ? 'border-red-100 bg-red-50' : tone === 'warn' ? 'border-yellow-100 bg-yellow-50' : tone === 'ok' ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-white'}`}>
    <p className="text-xs font-black uppercase text-gray-500">{label}</p>
    <p className={`${compact ? 'text-2xl' : 'text-3xl'} mt-2 font-black text-gray-950`}>{value}</p>
    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-gray-500">{tone === 'bad' ? <ArrowDownRight className="h-3 w-3 text-red-600" /> : <ArrowUpRight className="h-3 w-3 text-green-600" />}{hint}</p>
  </div>
);

const buildDashboardInsights = (summary: DashboardSummary, analytics: AnalyticsOverview | null): string[] => {
  const insights: string[] = [];
  if (summary.newLeads > 0) insights.push(`มีผู้ติดต่อใหม่ ${summary.newLeads} ราย ควรจัดลำดับการติดต่อกลับวันนี้`);
  if (summary.emailFailed > 0) insights.push(`พบอีเมลส่งล้มเหลว ${summary.emailFailed} รายการ ควรตรวจการตั้งค่า Resend`);
  if ((analytics?.sessions ?? 0) > 0 && (analytics?.conversionRate ?? 0) < 5) insights.push('อัตราเปลี่ยนจากผู้เข้าชมเป็นการส่งฟอร์มยังต่ำกว่า 5% ควรทบทวน CTA หรือฟอร์ม');
  if ((analytics?.lineClicks ?? 0) > (analytics?.contactFormSuccess ?? 0)) insights.push('ผู้ใช้กด LINE มากกว่าส่งฟอร์ม ควรให้ทีมตอบ LINE รวดเร็วเป็นพิเศษ');
  return insights.length ? insights : ['ยังมีข้อมูลไม่เพียงพอสำหรับสรุป insight เชิงลึก'];
};
