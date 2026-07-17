import { RefreshCw, SearchCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSeoPages, scanSeoPage, type SeoPage } from '../../services/admin-api';
import { Empty, issueLabel, Score } from './AdminSeoPage';

const filters = [
  ['', 'ทั้งหมด'],
  ['lt50', 'คะแนนต่ำกว่า 50'],
  ['50to79', 'คะแนน 50-79'],
  ['gte80', 'คะแนน 80+'],
  ['critical', 'มี Critical Issue'],
  ['meta', 'Meta ไม่ครบ'],
  ['schema', 'ไม่มี Schema'],
  ['never', 'ไม่เคยสแกน'],
] as const;

export const AdminSeoPagesPage = (): JSX.Element => {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scanningRoute, setScanningRoute] = useState('');

  const load = async (nextFilter = filter) => {
    setLoading(true);
    setError('');
    try {
      setPages(await getSeoPages(nextFilter));
    } catch {
      setError('โหลดรายการ SEO Pages ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const scan = async (routePath: string) => {
    setScanningRoute(routePath);
    try {
      await scanSeoPage(routePath);
      await load();
    } catch {
      setError('สแกนหน้านี้ไม่สำเร็จ');
    } finally {
      setScanningRoute('');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950">SEO Pages</h1>
          <p className="text-sm font-semibold text-gray-500">คะแนน ปัญหา และสถานะ SEO ของ Public Routes</p>
        </div>
        <button onClick={() => load()} className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">
          <RefreshCw className="h-4 w-4" /> โหลดใหม่
        </button>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <label className="block max-w-xs">
          <span className="text-xs font-black text-gray-500">ตัวกรอง</span>
          <select
            value={filter}
            onChange={event => {
              setFilter(event.target.value);
              void load(event.target.value);
            }}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-bold"
          >
            {filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>

      {error && <div className="rounded-md bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {loading ? <div className="rounded-lg bg-white p-6 font-bold shadow-sm">กำลังโหลด SEO Pages...</div> : pages.length === 0 ? <Empty /> : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-3">ชื่อหน้า</th>
                <th>Route</th>
                <th>คะแนนรวม</th>
                <th>Metadata</th>
                <th>Content</th>
                <th>Technical</th>
                <th>ปัญหา</th>
                <th>ร้ายแรงที่สุด</th>
                <th>สแกนล่าสุด</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => {
                const audit = page.latestAudit;
                const worst = audit?.issues.find(issue => issue.severity === 'CRITICAL') ?? audit?.issues.find(issue => issue.severity === 'HIGH') ?? audit?.issues[0];
                return (
                  <tr key={page.id} className="border-t border-gray-100 hover:bg-green-50/40">
                    <td className="p-3 font-black text-gray-950">{page.pageName}</td>
                    <td className="font-bold text-gray-600">{page.routePath}</td>
                    <td>{audit ? <Score value={audit.overallScore} /> : '-'}</td>
                    <td>{audit?.metadataScore ?? '-'}</td>
                    <td>{audit?.contentScore ?? '-'}</td>
                    <td>{audit?.technicalScore ?? '-'}</td>
                    <td>{audit?.issues.length ?? 0}</td>
                    <td className="max-w-[220px] truncate">{worst ? issueLabel(worst.code) : '-'}</td>
                    <td>{audit ? new Date(`${audit.createdAt.replace(' ', 'T')}Z`).toLocaleString('th-TH') : 'ยังไม่เคยสแกน'}</td>
                    <td>
                      <button
                        onClick={() => scan(page.routePath)}
                        disabled={scanningRoute === page.routePath}
                        className="inline-flex items-center gap-1 rounded-md bg-green-700 px-3 py-2 text-xs font-black text-white hover:bg-green-800 disabled:bg-gray-400"
                      >
                        <SearchCheck className="h-3 w-3" /> {scanningRoute === page.routePath ? 'สแกน...' : 'สแกน'}
                      </button>
                      <Link to={`/admin/seo/pages/${page.id}`} className="ml-2 text-xs font-black text-green-700 hover:text-green-900">รายละเอียด</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
