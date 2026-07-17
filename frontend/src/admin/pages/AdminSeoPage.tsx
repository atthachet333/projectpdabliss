import { RefreshCw, SearchCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSeoSummary, scanSeoSite, type SeoSummary } from '../../services/admin-api';

export const AdminSeoPage = (): JSX.Element => {
  const [summary, setSummary] = useState<SeoSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setSummary(await getSeoSummary());
    } catch {
      setError('โหลดข้อมูล SEO ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const scan = async () => {
    setScanning(true);
    setError('');
    try {
      await scanSeoSite();
      await load();
    } catch {
      setError('สแกน SEO ไม่สำเร็จ');
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <div className="rounded-lg bg-white p-6 font-bold shadow-sm">กำลังโหลดศูนย์ SEO...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950">ศูนย์วิเคราะห์ SEO</h1>
          <p className="text-sm font-semibold text-gray-500">ตรวจ Technical SEO, On-page SEO และจัดลำดับหน้าที่ควรแก้ก่อน</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={scan} disabled={scanning} className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800 disabled:bg-gray-400">
            <SearchCheck className="h-4 w-4" /> {scanning ? 'กำลังสแกน...' : 'สแกน SEO ทั้งเว็บไซต์'}
          </button>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">
            <RefreshCw className="h-4 w-4" /> โหลดใหม่
          </button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

      {summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <Metric label="คะแนน SEO เฉลี่ย" value={summary.averageScore} hint="/ 100" tone={summary.averageScore >= 80 ? 'ok' : summary.averageScore >= 50 ? 'warn' : 'bad'} />
            <Metric label="หน้าที่ตรวจแล้ว" value={`${summary.scannedPages}/${summary.totalPages}`} hint="Public routes" />
            <Metric label="ปัญหาเร่งด่วน" value={summary.criticalIssues} hint="Critical" tone={summary.criticalIssues ? 'bad' : 'ok'} />
            <Metric label="ปัญหาระดับสูง" value={summary.highIssues} hint="High" tone={summary.highIssues ? 'warn' : 'ok'} />
            <Metric label="หน้าพร้อมใช้งาน" value={summary.readyPages} hint="คะแนน 80+" tone="ok" />
            <Metric label="AI รออนุมัติ" value={summary.pendingRecommendations} hint="ยังไม่เปิดใช้ AI" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <section className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black">หน้าที่ควรแก้ก่อน</h2>
                <Link to="/admin/seo/pages" className="text-sm font-bold text-green-700 hover:text-green-900">ดูทุกหน้า</Link>
              </div>
              <div className="space-y-3">
                {summary.pagesNeedingWork.length === 0 ? <Empty /> : summary.pagesNeedingWork.map(page => (
                  <div key={page.route_path} className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                    <div>
                      <p className="font-black text-gray-950">{page.page_name}</p>
                      <p className="text-xs font-bold text-gray-500">{page.route_path}</p>
                    </div>
                    <Score value={Number(page.overall_score ?? 0)} />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">ปัญหาที่พบบ่อย</h2>
              <div className="mt-4 space-y-3">
                {summary.commonIssues.length === 0 ? <Empty /> : summary.commonIssues.map(item => (
                  <div key={item.code} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-sm font-bold text-gray-700">{issueLabel(item.code)}</span>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-gray-800">{item.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-lg border border-yellow-100 bg-yellow-50 p-5">
            <h2 className="text-lg font-black text-yellow-950">สถานะ SEO-A</h2>
            <p className="mt-2 text-sm font-semibold text-yellow-900">
              รอบนี้เป็นการสแกนจาก source และ SEO config ในฐานข้อมูลเท่านั้น ยังไม่เปลี่ยน metadata หน้า Public และยังไม่เปิด AI Integration
            </p>
          </section>
        </>
      )}
    </div>
  );
};

const Metric = ({ label, value, hint, tone }: { label: string; value: string | number; hint: string; tone?: 'ok' | 'warn' | 'bad' }): JSX.Element => (
  <div className={`rounded-lg border p-4 shadow-sm ${tone === 'bad' ? 'border-red-100 bg-red-50' : tone === 'warn' ? 'border-yellow-100 bg-yellow-50' : tone === 'ok' ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-white'}`}>
    <p className="text-xs font-black text-gray-500">{label}</p>
    <p className="mt-2 text-3xl font-black text-gray-950">{value}</p>
    <p className="text-xs font-bold text-gray-500">{hint}</p>
  </div>
);

export const Score = ({ value }: { value: number }): JSX.Element => (
  <span className={`inline-flex min-w-14 justify-center rounded-full px-3 py-1 text-sm font-black ${value >= 80 ? 'bg-green-50 text-green-700' : value >= 50 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{value}</span>
);

export const Empty = (): JSX.Element => <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm font-bold text-gray-500">ยังไม่มีข้อมูล</div>;

export const issueLabel = (code: string): string => ({
  MISSING_TITLE: 'ไม่มี SEO Title',
  MISSING_META_DESCRIPTION: 'ไม่มี Meta Description',
  MISSING_CANONICAL: 'ไม่มี Canonical',
  MISSING_H1: 'ไม่มี H1',
  MULTIPLE_H1: 'มี H1 มากกว่า 1 จุด',
  IMAGE_MISSING_ALT: 'รูปไม่มี alt',
  MISSING_SCHEMA: 'ไม่มี Structured Data',
  MISSING_ROBOTS_TXT: 'ไม่มี robots.txt',
  MISSING_SITEMAP: 'ไม่มี sitemap.xml',
}[code] ?? code);
