import { ArrowLeft, Mail, Phone, Save } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLeadById, updateLead, type ContactLead, type LeadStatus } from '../../services/admin-api';
import { EmailBadge, EmptyBox, ErrorBox, formatDate, StatusBadge } from './AdminDashboardPage';

const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED'];

export const AdminLeadDetailPage = (): JSX.Element => {
  const { id } = useParams();
  const [lead, setLead] = useState<ContactLead | null>(null);
  const [status, setStatus] = useState<LeadStatus>('NEW');
  const [note, setNote] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await getLeadById(id);
      setLead(data);
      setStatus(data.status);
      setNote(data.note ?? '');
      setAssignedTo(data.assignedTo ?? '');
    } catch {
      setError('โหลดรายละเอียด Lead ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!lead) return;
    setSaving(true);
    try {
      const updated = await updateLead(lead.id, { status, note, assignedTo });
      setLead(updated);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-lg bg-white p-6 font-bold shadow-sm">กำลังโหลดรายละเอียด...</div>;
  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!lead) return <EmptyBox />;

  const telHref = `tel:${lead.phone.replace(/[^\d+]/g, '')}`;
  const mailHref = lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) ? `mailto:${lead.email}` : undefined;

  return (
    <div className="space-y-5">
      <Link to="/admin/leads" className="inline-flex items-center gap-2 text-sm font-bold text-green-700"><ArrowLeft className="h-4 w-4" /> กลับหน้ารายการ</Link>
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-950">{lead.name}</h1>
            <p className="text-sm font-semibold text-gray-500">{lead.topic ?? 'ไม่มีหัวข้อ'}</p>
          </div>
          <div className="flex gap-2"><StatusBadge value={lead.status} /><EmailBadge value={lead.emailDeliveryStatus} /></div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="เบอร์โทร" value={lead.phone} />
          <Field label="อีเมล" value={lead.email ?? '-'} />
          <Field label="หน้าที่ส่งเข้ามา" value={lead.sourcePage ?? '-'} />
          <Field label="รหัสอีเมลจากผู้ให้บริการ" value={lead.emailProviderId ?? '-'} />
          <Field label="วันที่สร้าง" value={formatDate(lead.createdAt)} />
          <Field label="วันที่แก้ไข" value={formatDate(lead.updatedAt)} />
        </div>
        <div className="mt-5">
          <p className="text-xs font-black uppercase text-gray-500">รายละเอียด</p>
          <p className="mt-2 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm font-medium text-gray-800">{lead.details}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={telHref} className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"><Phone className="h-4 w-4" /> โทรหา</a>
          {mailHref && <a href={mailHref} className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800"><Mail className="h-4 w-4" /> ส่งอีเมล</a>}
        </div>
      </div>
      <form onSubmit={save} className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-gray-950">จัดการผู้ติดต่อ</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-xs font-black text-gray-500">สถานะ</span>
            <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={status} onChange={event => setStatus(event.target.value as LeadStatus)}>
              {statuses.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="text-xs font-black text-gray-500">ผู้รับผิดชอบ</span>
            <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={assignedTo} onChange={event => setAssignedTo(event.target.value)} />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="text-xs font-black text-gray-500">โน้ตภายใน</span>
          <textarea className="mt-1 min-h-32 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={note} onChange={event => setNote(event.target.value)} />
        </label>
        <button disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:bg-gray-400"><Save className="h-4 w-4" /> {saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
      </form>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <div>
    <p className="text-xs font-black uppercase text-gray-500">{label}</p>
    <p className="mt-1 break-words text-sm font-bold text-gray-950">{value}</p>
  </div>
);
