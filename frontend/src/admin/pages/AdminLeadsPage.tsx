import { Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, type ContactLead, type Pagination } from '../../services/admin-api';
import { EmailBadge, EmptyBox, ErrorBox, formatDate, StatusBadge } from './AdminDashboardPage';

export const AdminLeadsPage = (): JSX.Element => {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', emailDeliveryStatus: '', from: '', to: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (nextFilters = filters) => {
    setLoading(true);
      setError('');
    try {
      const result = await getLeads({ ...nextFilters, limit: 20 });
      setLeads(result.data);
      setPagination(result.pagination);
    } catch {
      setError('โหลด Leads ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    const nextFilters = { search: '', status: '', emailDeliveryStatus: '', from: '', to: '', page: 1 };
    setFilters(nextFilters);
    void load(nextFilters);
  };

  const newToday = leads.filter(lead => lead.status === 'NEW' && lead.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
  const pendingFollowUp = leads.filter(lead => ['NEW', 'FOLLOW_UP'].includes(lead.status)).length;
  const sentCount = leads.filter(lead => lead.emailDeliveryStatus === 'SENT').length;
  const failedCount = leads.filter(lead => lead.emailDeliveryStatus === 'FAILED').length;

  useEffect(() => {
    void load();
  }, [filters.page]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    void load(nextFilters);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-950">จัดการผู้ติดต่อ</h1>
        <p className="text-sm font-semibold text-gray-500">ค้นหา กรอง และติดตามสถานะลูกค้าที่ส่งข้อมูลผ่านเว็บไซต์</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <SmallInsight label="พบรายการ" value={pagination.total} hint="ตรงกับตัวกรองปัจจุบัน" />
        <SmallInsight label="ใหม่วันนี้" value={newToday} hint="ในหน้าปัจจุบัน" />
        <SmallInsight label="ยังต้องติดตาม" value={pendingFollowUp} hint="NEW + FOLLOW_UP" />
        <SmallInsight label="อีเมลล้มเหลว" value={failedCount} hint={`สำเร็จ ${sentCount} รายการ`} tone={failedCount ? 'bad' : 'ok'} />
      </div>
      <form onSubmit={submit} className="grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-6">
        <label className="md:col-span-2">
          <span className="text-xs font-black text-gray-500">ค้นหา ชื่อ / เบอร์ / อีเมล / หัวข้อ / รายละเอียด</span>
          <div className="mt-1 flex items-center rounded-md border border-gray-300 px-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input className="w-full px-2 py-2 text-sm outline-none" value={filters.search} onChange={event => setFilters({ ...filters, search: event.target.value })} />
          </div>
        </label>
        <Select label="สถานะ" value={filters.status} onChange={value => setFilters({ ...filters, status: value })} options={['', 'NEW', 'CONTACTED', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED']} />
        <Select label="สถานะอีเมล" value={filters.emailDeliveryStatus} onChange={value => setFilters({ ...filters, emailDeliveryStatus: value })} options={['', 'PENDING', 'SENT', 'FAILED']} />
        <Input label="วันที่เริ่ม" type="date" value={filters.from} onChange={value => setFilters({ ...filters, from: value })} />
        <Input label="วันที่สิ้นสุด" type="date" value={filters.to} onChange={value => setFilters({ ...filters, to: value })} />
        <div className="flex gap-2 md:col-span-6">
          <button className="rounded-md bg-gray-950 px-4 py-2 text-sm font-black text-white hover:bg-green-700">ค้นหา</button>
          <button type="button" onClick={resetFilters} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-black text-gray-700 hover:bg-gray-200">ล้างตัวกรอง</button>
        </div>
      </form>
      {loading ? <div className="rounded-lg bg-white p-6 font-bold shadow-sm">กำลังโหลดข้อมูลผู้ติดต่อ...</div> : error ? <ErrorBox message={error} onRetry={load} /> : leads.length === 0 ? <EmptyBox /> : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500">
              <tr><th className="p-3">ชื่อ</th><th>เบอร์โทร</th><th>อีเมล</th><th>หัวข้อ</th><th>สถานะ</th><th>สถานะอีเมล</th><th>วันที่</th><th>การจัดการ</th></tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-t border-gray-100 hover:bg-green-50/40">
                  <td className="p-3 font-bold">{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.email ?? '-'}</td>
                  <td className="max-w-[220px] truncate">{lead.topic ?? '-'}</td>
                  <td><StatusBadge value={lead.status} /></td>
                  <td><EmailBadge value={lead.emailDeliveryStatus} /></td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td><Link className="font-bold text-green-700" to={`/admin/leads/${lead.id}`}>ดูรายละเอียด</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between rounded-lg bg-white p-3 text-sm font-bold shadow-sm">
        <button disabled={pagination.page <= 1} onClick={() => setFilters(current => ({ ...current, page: current.page - 1 }))} className="rounded-md px-3 py-2 hover:bg-gray-100 disabled:text-gray-300">ก่อนหน้า</button>
        <span>หน้า {pagination.page} / {Math.max(pagination.totalPages, 1)}</span>
        <button disabled={pagination.page >= pagination.totalPages} onClick={() => setFilters(current => ({ ...current, page: current.page + 1 }))} className="rounded-md px-3 py-2 hover:bg-gray-100 disabled:text-gray-300">ถัดไป</button>
      </div>
    </div>
  );
};

const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }): JSX.Element => (
  <label>
    <span className="text-xs font-black text-gray-500">{label}</span>
    <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={value} onChange={event => onChange(event.target.value)}>
      {options.map(option => <option key={option} value={option}>{option || 'ทั้งหมด'}</option>)}
    </select>
  </label>
);

const SmallInsight = ({ label, value, hint, tone }: { label: string; value: number; hint: string; tone?: 'ok' | 'bad' }): JSX.Element => (
  <div className={`rounded-lg border p-4 shadow-sm ${tone === 'bad' ? 'border-red-100 bg-red-50' : tone === 'ok' ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-white'}`}>
    <p className="text-xs font-black text-gray-500">{label}</p>
    <p className="mt-1 text-2xl font-black text-gray-950">{value}</p>
    <p className="text-xs font-bold text-gray-500">{hint}</p>
  </div>
);

const Input = ({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }): JSX.Element => (
  <label>
    <span className="text-xs font-black text-gray-500">{label}</span>
    <input type={type} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={value} onChange={event => onChange(event.target.value)} />
  </label>
);
