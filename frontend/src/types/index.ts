import type { LucideIcon } from 'lucide-react';

export interface Service { id: string; title: string; description: string; icon: LucideIcon; documents: string[]; estimatedTime: string; }
export interface NavItem { label: string; path: string; }
export interface FeatureItem { title: string; description: string; icon: LucideIcon; }
export interface ProcessStep { number: number; title: string; description: string; }
export interface FAQItem { question: string; answer: string; }
export interface ContactFormData { name: string; phone: string; email: string; service: string; message: string; }
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;
