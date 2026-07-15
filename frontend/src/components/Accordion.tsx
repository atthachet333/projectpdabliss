import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { FAQItem } from '../types';
interface AccordionProps { items:FAQItem[]; }
export function Accordion({items}:AccordionProps):JSX.Element { const [active,setActive]=useState<number|null>(0); return <div className="space-y-3">{items.map((item,index)=><article className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={item.question}><button aria-expanded={active===index} onClick={()=>setActive(active===index?null:index)} className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900">{item.question}<ChevronDown className={`transition ${active===index?'rotate-180':''}`}/></button>{active===index&&<p className="border-t border-slate-100 px-5 py-4 leading-7 text-slate-600">{item.answer}</p>}</article>)}</div>; }
