import { FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSeoPage, updateSeoPage, type SeoPage } from '../../services/admin-api';
import { Empty, issueLabel, Score } from './AdminSeoPage';

type FormState = {
  pageName: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  schemaType: string;
  schemaJson: string;
};

const toForm = (page: SeoPage): FormState => ({
  pageName: page.pageName,
  title: page.title ?? '',
  metaDescription: page.metaDescription ?? '',
  canonicalUrl: page.canonicalUrl ?? '',
  robotsIndex: page.robotsIndex,
  robotsFollow: page.robotsFollow,
  ogTitle: page.ogTitle ?? '',
  ogDescription: page.ogDescription ?? '',
  ogImage: page.ogImage ?? '',
  twitterCard: page.twitterCard ?? 'summary_large_image',
  primaryKeyword: page.primaryKeyword ?? '',
  secondaryKeywords: page.secondaryKeywords ?? '[]',
  schemaType: page.schemaType ?? 'WebPage',
  schemaJson: page.schemaJson ?? '',
});

export const AdminSeoPageDetailPage = (): JSX.Element => {
  const { id = '' } = useParams();
  const [page, setPage] = useState<SeoPage | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await getSeoPage(id);
        setPage(result);
        setForm(toForm(result));
      } catch {
        setError('โหลดรายละเอียด SEO ไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const validate = (): string => {
    if (!form) return 'ข้อมูลไม่พร้อม';
    if (!form.title.trim()) return 'SEO Title ห้ามว่าง';
    if (form.title.length > 120) return 'SEO Title ยาวเกิน 120 ตัวอักษร';
    if (form.metaDescription.length > 220) return 'Meta Description ยาวเกิน 220 ตัวอักษร';
    if (form.canonicalUrl) try { new URL(form.canonicalUrl); } catch { return 'Canonical URL ไม่ถูกต้อง'; }
    if (form.ogImage) try { new URL(form.ogImage); } catch { return 'OG Image URL ไม่ถูกต้อง'; }
    if (!['summary', 'summary_large_image'].includes(form.twitterCard)) return 'Twitter Card ไม่ถูกต้อง';
    if (form.schemaJson) {
      if (form.schemaJson.includes('</script')) return 'Schema JSON มีข้อความที่ไม่ปลอดภัย';
      try { JSON.parse(form.schemaJson); } catch { return 'Schema JSON parse ไม่ได้'; }
    }
    return '';
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!page || !form) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateSeoPage(page.id, form);
      setPage(updated);
      setForm(toForm(updated));
      setSuccess('บันทึก SEO สำเร็จ หน้า Public จะใช้ metadata ใหม่นี้ทันที');
    } catch {
      setError('บันทึก SEO ไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-lg bg-white p-6 font-bold shadow-sm">กำลังโหลดรายละเอียด SEO...</div>;
  if (!page || !form) return <Empty />;

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <Link to="/admin/seo/pages" className="text-sm font-bold text-green-700 hover:text-green-900">กลับไป SEO Pages</Link>
        <h1 className="mt-2 text-2xl font-black text-gray-950">{page.pageName}</h1>
        <p className="text-sm font-semibold text-gray-500">{page.routePath}</p>
      </div>
      {error && <div className="rounded-md bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {success && <div className="rounded-md bg-green-50 p-4 text-sm font-bold text-green-700">{success}</div>}

      <div className="grid gap-4 md:grid-cols-4">
        <Panel label="คะแนนรวม">{page.latestAudit ? <Score value={page.latestAudit.overallScore} /> : '-'}</Panel>
        <Panel label="Metadata">{page.latestAudit?.metadataScore ?? '-'}</Panel>
        <Panel label="Content">{page.latestAudit?.contentScore ?? '-'}</Panel>
        <Panel label="Technical">{page.latestAudit?.technicalScore ?? '-'}</Panel>
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">แก้ไข SEO Metadata</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input label="ชื่อหน้า" value={form.pageName} onChange={value => setForm({ ...form, pageName: value })} />
            <Input label="SEO Title" value={form.title} max={120} onChange={value => setForm({ ...form, title: value })} />
            <Textarea label="Meta Description" value={form.metaDescription} max={220} onChange={value => setForm({ ...form, metaDescription: value })} />
            <Input label="Canonical URL" value={form.canonicalUrl} onChange={value => setForm({ ...form, canonicalUrl: value })} />
            <Input label="OG Title" value={form.ogTitle} max={120} onChange={value => setForm({ ...form, ogTitle: value })} />
            <Textarea label="OG Description" value={form.ogDescription} max={220} onChange={value => setForm({ ...form, ogDescription: value })} />
            <Input label="OG Image URL" value={form.ogImage} onChange={value => setForm({ ...form, ogImage: value })} />
            <label>
              <span className="text-xs font-black text-gray-500">Twitter Card</span>
              <select value={form.twitterCard} onChange={event => setForm({ ...form, twitterCard: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
              </select>
            </label>
            <Input label="Primary Keyword" value={form.primaryKeyword} onChange={value => setForm({ ...form, primaryKeyword: value })} />
            <Input label="Secondary Keywords JSON" value={form.secondaryKeywords} onChange={value => setForm({ ...form, secondaryKeywords: value })} />
            <Input label="Schema Type" value={form.schemaType} onChange={value => setForm({ ...form, schemaType: value })} />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.robotsIndex} onChange={event => setForm({ ...form, robotsIndex: event.target.checked })} /> Index</label>
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.robotsFollow} onChange={event => setForm({ ...form, robotsFollow: event.target.checked })} /> Follow</label>
            </div>
            <div className="md:col-span-2">
              <Textarea label="Schema JSON-LD แบบกำหนดเอง" value={form.schemaJson} rows={8} onChange={value => setForm({ ...form, schemaJson: value })} />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button disabled={saving} className="rounded-md bg-green-700 px-4 py-2 text-sm font-black text-white hover:bg-green-800 disabled:bg-gray-400">{saving ? 'กำลังบันทึก...' : 'บันทึก SEO'}</button>
            <button type="button" onClick={() => setForm(toForm(page))} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-black text-gray-700 hover:bg-gray-200">Reset เป็นค่าที่บันทึกไว้</button>
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Google Preview</h2>
            <p className="text-xs font-bold text-gray-500">ตัวอย่างการแสดงผลโดยประมาณ ไม่ใช่ผลจริงจาก Google</p>
            <div className="mt-4 rounded-md border border-gray-100 p-4">
              <p className="text-sm text-green-700">{form.canonicalUrl || page.routePath}</p>
              <p className="mt-1 text-xl font-normal text-blue-700">{form.title || 'SEO Title'}</p>
              <p className="mt-1 text-sm text-gray-600">{form.metaDescription || 'Meta Description'}</p>
            </div>
          </section>
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">ปัญหาที่พบล่าสุด</h2>
            {!page.latestAudit || page.latestAudit.issues.length === 0 ? <Empty /> : (
              <div className="mt-4 space-y-3">
                {page.latestAudit.issues.slice(0, 8).map(issue => (
                  <div key={`${issue.code}-${issue.evidence}`} className="rounded-md border border-gray-100 p-3">
                    <p className="font-black text-gray-950">{issueLabel(issue.code)}</p>
                    <p className="mt-1 text-xs font-bold text-gray-500">{issue.recommendation}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </form>
  );
};

const Panel = ({ label, children }: { label: string; children: ReactNode }): JSX.Element => (
  <div className="rounded-lg bg-white p-4 shadow-sm">
    <p className="text-xs font-black text-gray-500">{label}</p>
    <div className="mt-2 text-2xl font-black text-gray-950">{children}</div>
  </div>
);

const Input = ({ label, value, max, onChange }: { label: string; value: string; max?: number; onChange: (value: string) => void }): JSX.Element => (
  <label>
    <span className="text-xs font-black text-gray-500">{label}</span>
    <input value={value} maxLength={max} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    {max && <span className="mt-1 block text-xs font-bold text-gray-400">{value.length}/{max}</span>}
  </label>
);

const Textarea = ({ label, value, max, rows = 3, onChange }: { label: string; value: string; max?: number; rows?: number; onChange: (value: string) => void }): JSX.Element => (
  <label>
    <span className="text-xs font-black text-gray-500">{label}</span>
    <textarea rows={rows} value={value} maxLength={max} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    {max && <span className="mt-1 block text-xs font-bold text-gray-400">{value.length}/{max}</span>}
  </label>
);
