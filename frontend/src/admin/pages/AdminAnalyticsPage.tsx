import { RefreshCw } from 'lucide-react';
import { FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { eventLabel, eventTypeLabel, pageLabel, referrerLabel } from '../analytics-labels';
import {
  getAnalyticsDevices,
  getAnalyticsEvents,
  getAnalyticsOverview,
  getAnalyticsPages,
  getAnalyticsReferrers,
  type AnalyticsDevice,
  type AnalyticsEventRow,
  type AnalyticsOverview,
  type AnalyticsPage,
  type AnalyticsQuery,
  type AnalyticsReferrer,
} from '../../services/admin-api';

type RangePreset = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'lastMonth' | 'custom';

const isoDate = (date: Date): string => date.toISOString().slice(0, 10);

const presetRange = (preset: RangePreset): { from: string; to: string } => {
  const now = new Date();
  const from = new Date(now);
  if (preset === 'today') return { from: isoDate(now), to: isoDate(now) };
  if (preset === 'yesterday') {
    from.setDate(now.getDate() - 1);
    return { from: isoDate(from), to: isoDate(from) };
  }
  if (preset === '7d') from.setDate(now.getDate() - 6);
  if (preset === '30d') from.setDate(now.getDate() - 29);
  if (preset === 'month') from.setDate(1);
  if (preset === 'lastMonth') {
    from.setMonth(now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: isoDate(from), to: isoDate(last) };
  }
  return { from: isoDate(from), to: isoDate(now) };
};

export const AdminAnalyticsPage = (): JSX.Element => {
  const [preset, setPreset] = useState<RangePreset>('30d');
  const [from, setFrom] = useState(presetRange('30d').from);
  const [to, setTo] = useState(presetRange('30d').to);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [pages, setPages] = useState<AnalyticsPage[]>([]);
  const [events, setEvents] = useState<AnalyticsEventRow[]>([]);
  const [referrers, setReferrers] = useState<AnalyticsReferrer[]>([]);
  const [devices, setDevices] = useState<AnalyticsDevice[]>([]);

  const query = useMemo<AnalyticsQuery>(() => ({ from, to, limit: 20 }), [from, to]);

  const load = async () => {
    if (from > to) {
      setError('ช่วงวันที่ไม่ถูกต้อง');
      return;
    }
    setLoading(true);
    setError('');
    const [overviewResult, pagesResult, eventsResult, referrersResult, devicesResult] = await Promise.allSettled([
      getAnalyticsOverview(query),
      getAnalyticsPages(query),
      getAnalyticsEvents(query),
      getAnalyticsReferrers(query),
      getAnalyticsDevices(query),
    ]);
    if (overviewResult.status === 'fulfilled') setOverview(overviewResult.value); else setError('โหลด Overview ไม่สำเร็จ');
    if (pagesResult.status === 'fulfilled') setPages(pagesResult.value);
    if (eventsResult.status === 'fulfilled') setEvents(eventsResult.value);
    if (referrersResult.status === 'fulfilled') setReferrers(referrersResult.value);
    if (devicesResult.status === 'fulfilled') setDevices(devicesResult.value);
    setUpdatedAt(new Date().toLocaleString('th-TH'));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [query]);

  const applyPreset = (next: RangePreset) => {
    setPreset(next);
    if (next !== 'custom') {
      const range = presetRange(next);
      setFrom(range.from);
      setTo(range.to);
    }
  };

  const applyCustom = (event: FormEvent) => {
    event.preventDefault();
    setPreset('custom');
    void load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950">วิเคราะห์การใช้งานเว็บไซต์</h1>
          <p className="text-sm font-semibold text-gray-500">ภาพรวมพฤติกรรมผู้เข้าชม คลิกปุ่ม และการส่งฟอร์มจากข้อมูลจริง</p>
          <p className="mt-1 text-xs font-bold text-gray-400">ช่วงที่ดู: {from} ถึง {to}</p>
          {updatedAt && <p className="mt-1 text-xs font-bold text-gray-400">อัปเดตล่าสุด {updatedAt}</p>}
        </div>
        <button disabled={loading} onClick={load} className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:bg-gray-400">
          <RefreshCw className="h-4 w-4" /> โหลดข้อมูลใหม่
        </button>
      </div>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {(['today', 'yesterday', '7d', '30d', 'month', 'lastMonth'] as RangePreset[]).map(item => (
            <button key={item} onClick={() => applyPreset(item)} className={`rounded-md px-3 py-2 text-sm font-bold ${preset === item ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {item === 'today' ? 'วันนี้' : item === 'yesterday' ? 'เมื่อวาน' : item === '7d' ? '7 วันล่าสุด' : item === '30d' ? '30 วันล่าสุด' : item === 'month' ? 'เดือนนี้' : 'เดือนที่แล้ว'}
            </button>
          ))}
        </div>
        <form onSubmit={applyCustom} className="mt-4 grid gap-3 sm:grid-cols-[1fr,1fr,auto]">
          <input type="date" value={from} onChange={event => { setPreset('custom'); setFrom(event.target.value); }} className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <input type="date" value={to} onChange={event => { setPreset('custom'); setTo(event.target.value); }} className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <button className="rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">ใช้ช่วงวันที่</button>
          <button type="button" onClick={() => applyPreset('30d')} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 sm:col-span-3">รีเซ็ตเป็น 30 วันล่าสุด</button>
        </form>
      </section>

      {error && <div className="rounded-md bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {loading && <div className="rounded-lg bg-white p-6 font-bold shadow-sm">กำลังโหลด Analytics...</div>}
      {overview && <Summary overview={overview} />}
      {overview && <Timeline timeline={overview.timeline} />}
      {overview && <Insights overview={overview} pages={pages} events={events} devices={devices} />}
      <div className="grid gap-6 xl:grid-cols-2">
        <TopPages pages={pages} />
        <TopEvents events={events} />
        <Referrers rows={referrers} />
        <Devices rows={devices} />
      </div>
    </div>
  );
};

const Summary = ({ overview }: { overview: AnalyticsOverview }): JSX.Element => {
  const cards = [
    ['จำนวนการเข้าชมหน้า', overview.pageViews],
    ['จำนวนเซสชัน', overview.sessions],
    ['ผู้เข้าชมไม่ซ้ำ', overview.estimatedUniqueVisitors],
    ['การคลิกปุ่ม', overview.buttonClicks],
    ['การคลิกบริการ', overview.serviceClicks],
    ['การคลิก LINE', overview.lineClicks],
    ['การกดส่งฟอร์ม', overview.contactFormSubmits],
    ['ส่งฟอร์มสำเร็จ', overview.contactFormSuccess],
    ['อัตราเปลี่ยนเป็นการติดต่อ', `${overview.conversionRate ?? 0}%`],
    ['หน้าต่อเซสชัน', overview.averagePagesPerSession],
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="rounded-lg bg-white p-4 shadow-sm"><p className="text-xs font-black uppercase text-gray-500">{label}</p><p className="mt-2 text-2xl font-black text-gray-950">{value ?? 0}</p></div>)}</div>;
};

const Timeline = ({ timeline }: { timeline: AnalyticsOverview['timeline'] }): JSX.Element => {
  const max = Math.max(...timeline.map(item => item.count), 1);
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black">แนวโน้มตามช่วงเวลา</h2>
      {timeline.length === 0 ? <Empty /> : <div className="mt-5 flex h-56 items-end gap-2 overflow-x-auto">
        {timeline.map(item => <div key={item.date} className="flex min-w-10 flex-1 flex-col items-center gap-2"><div title={`${item.date}: ${item.count}`} className="w-full rounded-t bg-green-600" style={{ height: `${Math.max((item.count / max) * 190, 4)}px` }} /><span className="text-[10px] font-bold text-gray-500">{item.date.slice(5)}</span></div>)}
      </div>}
    </section>
  );
};

const TopPages = ({ pages }: { pages: AnalyticsPage[] }): JSX.Element => (
  <Panel title="หน้าที่ได้รับความนิยม">{pages.length === 0 ? <Empty /> : <Table headers={['อันดับ', 'หน้า', 'จำนวนเข้าชม', 'เซสชัน', 'สัดส่วน']} rows={pages.map((row, index) => [index + 1, `${pageLabel(row.pagePath)} (${row.pagePath})`, row.views, row.uniqueSessions, `${row.percentage}%`])} />}</Panel>
);

const TopEvents = ({ events }: { events: AnalyticsEventRow[] }): JSX.Element => (
  <Panel title="ปุ่มและเหตุการณ์ที่ถูกใช้งานมากที่สุด">{events.length === 0 ? <Empty /> : <Table headers={['ชื่อที่อ่านง่าย', 'หมวดหมู่', 'จำนวนครั้ง', 'เซสชัน']} rows={events.map(row => [eventLabel(row.eventName), eventTypeLabel(row.eventType), row.count, row.uniqueSessions])} />}</Panel>
);

const Referrers = ({ rows }: { rows: AnalyticsReferrer[] }): JSX.Element => (
  <Panel title="แหล่งที่มาของผู้เข้าชม">{rows.length === 0 ? <Empty /> : <Table headers={['แหล่งที่มา', 'เซสชัน']} rows={rows.map(row => [referrerLabel(row.referrer), row.sessions])} />}</Panel>
);

const Devices = ({ rows }: { rows: AnalyticsDevice[] }): JSX.Element => (
  <Panel title="อุปกรณ์ Browser และระบบปฏิบัติการ">{rows.length === 0 ? <Empty /> : <Table headers={['อุปกรณ์', 'Browser', 'OS', 'เซสชัน']} rows={rows.map(row => [deviceLabel(row.deviceType), row.browser, row.operatingSystem, row.sessions])} />}</Panel>
);

const Panel = ({ title, children }: { title: string; children: ReactNode }): JSX.Element => (
  <section className="rounded-lg bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-black">{title}</h2>{children}</section>
);

const Table = ({ headers, rows }: { headers: string[]; rows: Array<Array<string | number>> }): JSX.Element => (
  <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="text-xs uppercase text-gray-500"><tr>{headers.map(header => <th key={header} className="py-2 pr-4">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t border-gray-100">{row.map((cell, cellIndex) => <td key={cellIndex} className="py-3 pr-4 font-semibold text-gray-700">{cell}</td>)}</tr>)}</tbody></table></div>
);

const Empty = (): JSX.Element => <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm font-bold text-gray-500">ยังไม่มีข้อมูลในช่วงเวลานี้</div>;

const deviceLabel = (value: string): string => ({ mobile: 'มือถือ', desktop: 'เดสก์ท็อป', tablet: 'แท็บเล็ต', unknown: 'ไม่ทราบ' }[value] ?? value);

const Insights = ({ overview, pages, events, devices }: { overview: AnalyticsOverview; pages: AnalyticsPage[]; events: AnalyticsEventRow[]; devices: AnalyticsDevice[] }): JSX.Element => {
  const topPage = pages[0];
  const topEvent = events[0];
  const topDevice = devices[0];
  const insights = [
    topPage ? `หน้าที่มีคนเข้ามากที่สุดคือ ${pageLabel(topPage.pagePath)} (${topPage.views} ครั้ง)` : 'ยังไม่มีข้อมูลหน้าที่ได้รับความนิยม',
    topEvent ? `เหตุการณ์ที่ถูกใช้งานมากที่สุดคือ ${eventLabel(topEvent.eventName)} (${topEvent.count} ครั้ง)` : 'ยังไม่มีข้อมูลการคลิกหรือเหตุการณ์สำคัญ',
    overview.sessions > 0 && overview.conversionRate < 5 ? 'Conversion ต่ำกว่า 5% ควรทบทวน CTA และความยาวฟอร์ม' : `Conversion อยู่ที่ ${overview.conversionRate}%`,
    overview.contactFormSubmits > overview.contactFormSuccess ? 'มีการกดส่งฟอร์มมากกว่าสำเร็จ ควรตรวจ Contact API หรือ validation' : 'การส่งฟอร์มสำเร็จสอดคล้องกับจำนวน submit',
    topDevice ? `อุปกรณ์หลักคือ ${deviceLabel(topDevice.deviceType)} ควรตรวจ UX บนอุปกรณ์กลุ่มนี้ก่อน` : 'ยังไม่มีข้อมูลอุปกรณ์',
  ];
  return <section className="rounded-lg border border-green-100 bg-green-50 p-5"><h2 className="text-lg font-black text-green-950">สรุปผลการวิเคราะห์และข้อเสนอแนะ</h2><ul className="mt-3 space-y-2 text-sm font-semibold text-green-900">{insights.map(item => <li key={item}>• {item}</li>)}</ul></section>;
};
