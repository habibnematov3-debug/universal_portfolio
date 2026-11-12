import { z } from 'zod';
const text = z.string().max(10000);
const translated = z.object({ uz: text, ru: text, en: text });
export function safeLink(value: string): string | undefined {
  if (!value || /[\u0000-\u0020\\]/.test(value)) return undefined;
  if (/^https?:\/\//i.test(value)) {
    try { const url = new URL(value); return url.username || url.password ? undefined : url.href; } catch { return undefined; }
  }
  if (/^[\w-][\w./-]*$/.test(value) && !value.split('/').includes('..')) return value;
  return undefined;
}
export function safeImage(value: string) {
  return /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value) ? value : safeLink(value);
}
const link = z.string().max(2048).refine(v => !v || !!safeLink(v), 'Use an HTTPS URL or a relative file path');
const image = z.string().max(2000000).refine(v => !v || !!safeImage(v), 'Use a PNG, JPEG, WebP, or image URL');
const color = z.string().refine(v => !v || /^#[0-9a-f]{6}$/i.test(v), 'Use a six-digit hex color');
export const portfolioSchema = z.object({
  defaultLanguage: z.enum(['uz', 'ru', 'en']),
  field: z.enum(['computer-engineering','it-business','business','english-philology','korean-philology','architecture','civil-engineering','interior-design']),
  appearance: z.object({ accent: color, paper: color, font: z.enum(['', 'Georgia, serif', 'Arial, sans-serif', 'monospace']) }),
  demo: z.boolean(), name: translated, initials: z.string().max(6), photo: image,
  email: z.union([z.literal(''), z.string().email().max(254)]), resume: link,
  links: z.array(z.object({ label: z.string().max(80), url: link })).max(15),
  available: z.boolean(), role: translated, headline: translated, intro: translated, location: translated, about: translated,
  skills: z.array(z.string().max(80)).max(40),
  experience: z.array(z.object({ period: z.string().max(60), title: translated, organization: translated, description: translated })).max(30),
  projects: z.array(z.object({ id: z.string().min(1).max(80), year: z.string().max(30), image, url: link, tags: z.array(z.string().max(80)).max(20), title: translated, category: translated, summary: translated, contribution: translated, result: translated })).max(30),
}).refine(p => new Set(p.projects.map(x => x.id)).size === p.projects.length, 'Project IDs must be unique');
export type PortfolioData = z.infer<typeof portfolioSchema>;
export function textOnColor(hex: string) {
  const rgb = hex.slice(1).match(/.{2}/g)!.map(value => {
    const c = parseInt(value,16) / 255;
    return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  });
  const luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  return luminance > .179 ? '#111111' : '#ffffff';
}
export function readiness(p: PortfolioData) {
  const issues: string[] = [];
  if (p.demo) issues.push('Namunaviy rejimni o‘chiring / Отключите демо / Turn off demo mode');
  if (!p.email && !p.links.some(l => l.url)) issues.push('Aloqa / Контакты / Contact');
  if (!p.photo) issues.push('Rasm / Фото / Portrait');
  if (!p.projects.length) issues.push('Loyihalar / Проекты / Projects');
  for (const lang of ['uz', 'ru', 'en'] as const) {
    if (![p.name, p.role, p.headline, p.about].every(v => v[lang].trim())) issues.push(`${lang.toUpperCase()}: profil / профиль / profile`);
    if (p.projects.some(x => ![x.title, x.summary, x.contribution, x.result].every(v => v[lang].trim()))) issues.push(`${lang.toUpperCase()}: loyiha matnlari / тексты проектов / project text`);
  }
  return issues;
}
