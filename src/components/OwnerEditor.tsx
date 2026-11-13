'use client';
import { useEffect, useState, type ChangeEvent } from 'react';
import { portfolioSchema, readiness, type PortfolioData } from '../lib/portfolio-model';
import { themes, fieldNames, layouts, type Language } from '../portfolio-content';
import { createProject, duplicateProject } from '../lib/project-presets';
import PersonalPortfolio from './PersonalPortfolio';

const words: Record<string, [string, string, string]> = {
  title: ['Portfolio tahrirlash', 'Редактор портфолио', 'Portfolio editor'],
  itemTitle: ['Sarlavha', 'Заголовок', 'Title'],
  unsaved: ['Saqlanmagan o‘zgarishlar bor', 'Есть несохранённые изменения', 'Unsaved changes'],
  loaded: ['Fayl ochildi', 'Данные загружены', 'Content loaded'],
  newProject: ['Yangi loyiha qo‘shish', 'Добавить проект', 'Add a new project'],
  untitled: ['Nomsiz loyiha', 'Проект без названия', 'Untitled project'],
  duplicate: ['Nusxalash', 'Дублировать', 'Duplicate'],
  visible: ['Ko‘rinishda chiqarish', 'Показывать в портфолио', 'Show in portfolio'],
  featured: ['Birinchi o‘ringa ajratish', 'Выделить первым', 'Feature first'],
  up: ['Yuqoriga', 'Выше', 'Move up'], down: ['Pastga', 'Ниже', 'Move down'],
  layout: ['Sahifa ko‘rinishi', 'Макет страницы', 'Page layout'],
  prompts: ['Yo‘nalishga mos tafsilotlar', 'Детали по специальности', 'Field-specific details'],
  value: ['Javob', 'Ответ', 'Answer'], caption: ['Rasm izohi', 'Подпись', 'Caption'],
  gallery: ['Galereya (6 tagacha rasm)', 'Галерея (до 6 изображений)', 'Gallery (up to 6 images)'],
  addImage: ['Galereyaga rasm qo‘shish', 'Добавить изображение', 'Add gallery image'],
  addDetail: ['Qo‘shimcha maydon', 'Добавить поле', 'Add a detail'],
  loadPrompts: ['Yo‘nalish savollarini qo‘shish', 'Добавить вопросы по специальности', 'Add field prompts'],
  draftFound: ['Saqlangan qoralama bor. Uni ochib davom etishingiz mumkin.', 'Найден черновик. Откройте его, чтобы продолжить.', 'A saved draft is available. Restore it to continue.'],
  note: ['O‘zgarishlar faqat shu qurilmada. Nashr uchun faylni yuklab olib public/portfolio.json o‘rniga qo‘ying va GitHub’ga yuboring.', 'Изменения остаются на этом устройстве. Для публикации скачайте файл, замените public/portfolio.json и отправьте изменения в GitHub.', 'Changes stay on this device. To publish, download the file, replace public/portfolio.json, and push to GitHub.'],
  save: ['Qoralamani saqlash', 'Сохранить черновик', 'Save draft'], restore: ['Qoralamani ochish', 'Открыть черновик', 'Restore draft'],
  download: ['Nashr faylini olish', 'Скачать для публикации', 'Download publishing file'], import: ['Fayldan ochish', 'Импорт файла', 'Import file'],
  preview: ['Ko‘rinish', 'Предпросмотр', 'Preview'], edit: ['Tahrirlash', 'Редактировать', 'Edit'],
  profile: ['Shaxsiy ma’lumot', 'Профиль', 'Profile'], design: ['Mavzu', 'Оформление', 'Appearance'],
  projects: ['Loyihalar', 'Проекты', 'Projects'], experience: ['Ta’lim va tajriba', 'Образование и опыт', 'Education & experience'], links: ['Ijtimoiy havolalar', 'Социальные ссылки', 'Social links'],
  name: ['Ism familiya', 'Имя', 'Name'], initials: ['Bosh harflar', 'Инициалы', 'Initials'], role: ['Kasb yoki yo‘nalish', 'Специальность', 'Role'], headline: ['Bosh sarlavha', 'Главный заголовок', 'Headline'], intro: ['Qisqa tanishtiruv', 'Краткое описание', 'Introduction'], location: ['Manzil', 'Местоположение', 'Location'], about: ['O‘zingiz haqingizda', 'О себе', 'About'], email: ['Email', 'Email', 'Email'], resume: ['Rezyume fayli yoki havolasi', 'Файл или ссылка на резюме', 'Résumé file or URL'], photo: ['Portret', 'Портрет', 'Portrait'], skills: ['Ko‘nikmalar (vergul bilan)', 'Навыки (через запятую)', 'Skills (comma separated)'],
  field: ['Yo‘nalish', 'Направление', 'Field'], accent: ['Asosiy rang', 'Акцентный цвет', 'Accent color'], paper: ['Fon rangi', 'Цвет фона', 'Background'], font: ['Sarlavha shrifti', 'Шрифт заголовка', 'Heading font'], defaultLanguage: ['Boshlang‘ich til', 'Язык по умолчанию', 'Default language'], available: ['Ish takliflariga ochiq', 'Открыт к предложениям', 'Open to opportunities'], demo: ['Namunaviy portfolio', 'Демонстрационный режим', 'Sample portfolio'],
  add: ['Qo‘shish', 'Добавить', 'Add'], remove: ['O‘chirish', 'Удалить', 'Remove'], upload: ['Rasm yuklash', 'Загрузить фото', 'Upload image'],
  category: ['Loyiha turi', 'Категория', 'Category'], summary: ['Qisqa tavsif', 'Краткое описание', 'Summary'], contribution: ['Sizning hissangiz', 'Ваш вклад', 'Your contribution'], result: ['Natija', 'Результат', 'Outcome'], year: ['Yil', 'Год', 'Year'], image: ['Loyiha rasmi', 'Изображение', 'Project image'], url: ['Havola', 'Ссылка', 'URL'], tags: ['Vositalar (vergul bilan)', 'Инструменты (через запятую)', 'Tools (comma separated)'], period: ['Davr', 'Период', 'Period'], organization: ['Tashkilot', 'Организация', 'Organization'], description: ['Tavsif', 'Описание', 'Description'], label: ['Nomi', 'Название', 'Label'],
  saved: ['Qoralama saqlandi', 'Черновик сохранён', 'Draft saved'], empty: ['Saqlangan qoralama topilmadi', 'Черновик не найден', 'No draft found'], invalid: ['Fayl yoki qiymat noto‘g‘ri', 'Некорректный файл или значение', 'Invalid file or value'], exported: ['Fayl tayyor. Uni public/portfolio.json o‘rniga qo‘ying va GitHub’ga yuboring.', 'Файл готов. Замените public/portfolio.json и отправьте изменения в GitHub.', 'File ready. Replace public/portfolio.json and push to GitHub.'],
  confirm: ['Hozirgi tahrirlarni almashtirasizmi?', 'Заменить текущие изменения?', 'Replace current edits?'], check: ['Nashrdan oldin to‘ldiring', 'Заполните перед публикацией', 'Complete before publishing'],
};
const blankText = () => ({ uz: '', ru: '', en: '' });
export default function OwnerEditor({ initial }: { initial: PortfolioData }) {
  const draftKey = 'folio-owner-draft-v2:' + (typeof location === 'undefined' ? '' : location.pathname.replace(/\/+$/, ''));
  const [data, setData] = useState<PortfolioData>(() => structuredClone(initial));
  const [lang, setLang] = useState<Language>(initial.defaultLanguage);
  const [preview, setPreview] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  useEffect(() => { try { setHasDraft(!!localStorage.getItem(draftKey)); } catch {} }, [draftKey]);
  const [status, setStatus] = useState('');
  const [savedData, setSavedData] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(data) !== savedData;
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const w = (key: string) => words[key]?.[['uz','ru','en'].indexOf(lang)] || key;
  function addProject() {
    if (data.projects.length >= 30) return;
    const project = createProject(data.field);
    update(['projects'], [...data.projects,project]); setActiveProject(project.id); setPreview(false);
    requestAnimationFrame(() => document.getElementById('owner-projects')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  function moveProject(index: number, step: number) {
    const next = index + step; if (next < 0 || next >= data.projects.length) return;
    const items = [...data.projects]; [items[index],items[next]]=[items[next],items[index]]; update(['projects'],items);
  }
  function update(path: (string | number)[], value: unknown) {
    setData(old => { const copy = structuredClone(old); let target: any = copy; for (const key of path.slice(0,-1)) target = target[key]; target[path.at(-1)!] = value; return copy; });
  }
  function validate() {
    const result = portfolioSchema.safeParse(data);
    if (!result.success) { setStatus(`${w('invalid')}: ${result.error.issues.map(i => i.path.join('.')).join(', ')}`); return null; }
    if (new Blob([JSON.stringify(result.data, null, 2)]).size > 15000000) {
      setStatus(['Portfolio 15 MB dan oshdi. Rasmlarni kamaytiring.', 'Портфолио больше 15 МБ. Уменьшите изображения.', 'Portfolio exceeds 15 MB. Reduce the images.'][['uz','ru','en'].indexOf(lang)]);
      return null;
    }
    return result.data;
  }
  function save() { const valid = validate(); if (!valid) return; try { localStorage.setItem(draftKey, JSON.stringify(valid)); setHasDraft(true); setSavedData(JSON.stringify(valid)); setStatus(w('saved')); } catch { setStatus('Saqlanmadi / Не сохранено / Not saved — download the file instead.'); } }
  function restore() { try { const raw = localStorage.getItem(draftKey); if (!raw) { setStatus(w('empty')); return; } const next = portfolioSchema.parse(JSON.parse(raw)); if (confirm(w('confirm'))) { setData(next); setSavedData(JSON.stringify(next)); setStatus(w('loaded')); } } catch { setStatus(w('invalid')); } }
  function download() {
    const valid = validate(); if (!valid) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(valid, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'portfolio.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setSavedData(JSON.stringify(valid)); setStatus(w('exported'));
  }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    try { if (file.size > 15000000) throw Error(); const next = portfolioSchema.parse(JSON.parse(await file.text())); if (confirm(w('confirm'))) { setData(next); setSavedData(JSON.stringify(next)); setStatus(w('loaded')); } } catch { setStatus(w('invalid')); }
  }
  async function upload(event: ChangeEvent<HTMLInputElement>, path: (string | number)[]) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    let bitmap: ImageBitmap | undefined;
    try {
      if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 15000000) throw Error();
      bitmap = await createImageBitmap(file); const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL('image/webp', .82); if (image.length > 2000000) throw Error(); update(path, image); setStatus('✓');
    } catch { setStatus(`${w('invalid')} — PNG / JPEG / WebP, ≤ 15 MB`); } finally { bitmap?.close(); }
  }
  function field(key: string, value: any, path: (string | number)[]) {
    const id = path.join('-');
    if (value && typeof value === 'object' && 'uz' in value) return <label key={id} htmlFor={id}>{w(key === 'title' ? 'itemTitle' : key)} · {lang.toUpperCase()}<textarea id={id} rows={['about','description','contribution','result','summary'].includes(key) ? 4 : 2} value={value[lang]} onChange={e => update([...path, lang], e.target.value)} /></label>;
    if (key === 'image' || key === 'photo') return <div key={id} className="editor-image"><label htmlFor={id}>{w(key)}<input id={id} value={value.startsWith('data:') ? '' : value} placeholder="https://… / portrait.jpg" onChange={e => update(path, e.target.value)} /></label>{value && <><img src={value} alt=""/><button type="button" onClick={() => update(path, '')}>{w('remove')}</button></>}<label className="upload-control">{w('upload')}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => void upload(e,path)} /></label></div>;
    if (Array.isArray(value)) return <label key={id} htmlFor={id}>{w(key)}<input id={id} value={value.join(', ')} onChange={e => update(path,e.target.value.split(',').map(s => s.trim()))} onBlur={e => update(path,e.target.value.split(',').map(s => s.trim()).filter(Boolean))}/></label>;
    return <label key={id} htmlFor={id}>{w(key)}<input id={id} type={key === 'email' ? 'email' : 'text'} value={value} onChange={e => update(path,e.target.value)} /></label>;
  }
  function projectsEditor() {
    return <section id="owner-projects" className="projects-editor">
      <div className="projects-editor-heading"><h2>{w('projects')} ({data.projects.length}/30)</h2><button className="primary" disabled={data.projects.length >= 30} onClick={addProject}>{w('newProject')} +</button></div>
      {data.projects.map((project,i) => <details key={project.id} className="project-editor-card" open={activeProject === project.id}>
        <summary onClick={e => {e.preventDefault();setActiveProject(activeProject === project.id ? null : project.id);}}><span>{project.featured ? '★ ' : ''}{project.title[lang] || w('untitled')}</span><small>{String(i+1).padStart(2,'0')}{!project.visible && ' · ◌'}</small></summary>
        <div className="project-options">{(['visible','featured'] as const).map(key => <label key={key}><input type="checkbox" checked={project[key]} onChange={e => update(['projects',i,key],e.target.checked)}/>{w(key)}</label>)}</div>
        <div className="owner-fields">{(['title','category','year','summary','contribution','result','tags','url','image'] as const).map(key => field(key,project[key],['projects',i,key]))}</div>
        <section className="project-extra-fields"><h3>{w('prompts')}</h3><p>{fieldNames[data.field][lang]}</p>
          {project.details.map((detail,j) => <fieldset key={j}><legend>{j+1}</legend><div className="owner-fields">{field('label',detail.label,['projects',i,'details',j,'label'])}{field('value',detail.value,['projects',i,'details',j,'value'])}</div><button onClick={() => {if(confirm(w('remove')+'?')) update(['projects',i,'details'],project.details.filter((_,k)=>k!==j));}}>{w('remove')}</button></fieldset>)}
          <div className="item-actions"><button disabled={project.details.length >= 10} onClick={() => update(['projects',i,'details'],[...project.details,{label:blankText(),value:blankText()}])}>{w('addDetail')} +</button>
          {project.details.length === 0 && <button onClick={() => update(['projects',i,'details'],createProject(data.field).details)}>{w('loadPrompts')}</button>}</div>
        </section>
        <section className="project-extra-fields"><h3>{w('gallery')}</h3>{project.gallery.map((item,j) => <fieldset key={j}><legend>{j+1}</legend><div className="owner-fields">{field('image',item.image,['projects',i,'gallery',j,'image'])}{field('caption',item.caption,['projects',i,'gallery',j,'caption'])}</div><button onClick={() => {if(confirm(w('remove')+'?')) update(['projects',i,'gallery'],project.gallery.filter((_,k)=>k!==j));}}>{w('remove')}</button></fieldset>)}<button disabled={project.gallery.length >= 6} onClick={() => update(['projects',i,'gallery'],[...project.gallery,{image:'',caption:blankText()}])}>{w('addImage')} +</button></section>
        <div className="item-actions project-actions"><button disabled={i===0} onClick={() => moveProject(i,-1)}>↑ {w('up')}</button><button disabled={i===data.projects.length-1} onClick={() => moveProject(i,1)}>↓ {w('down')}</button><button disabled={data.projects.length>=30} onClick={() => { const copy=duplicateProject(project);const projects=[...data.projects];projects.splice(i+1,0,copy);update(['projects'],projects);setActiveProject(copy.id);}}>{w('duplicate')}</button><button onClick={() => {if(confirm(w('remove')+'?')) update(['projects'],data.projects.filter(x=>x.id!==project.id));}}>{w('remove')}</button></div>
      </details>)}
    </section>;
  }
  const issues = readiness(data);
  return <div className="owner-editor" lang={lang}><header className="owner-toolbar"><strong>{w('title')}</strong><select aria-label="Language" value={lang} onChange={e => setLang(e.target.value as Language)}><option value="uz">O‘zbekcha</option><option value="ru">Русский</option><option value="en">English</option></select><button onClick={() => setPreview(!preview)}>{w(preview ? 'edit' : 'preview')}</button><a href={typeof location !== 'undefined' ? location.pathname : './'}>↗ Portfolio</a></header>
    <div className="owner-actions"><p>{w('note')}</p>{hasDraft && <p>{w('draftFound')}</p>}<div><button onClick={save}>{w('save')}</button><button disabled={data.projects.length>=30} onClick={addProject}>{w('newProject')} +</button><button onClick={restore}>{w('restore')}</button><label className="upload-control">{w('import')}<input type="file" accept="application/json,.json" onChange={e => void importFile(e)} /></label><button className="primary" onClick={download}>{w('download')}</button></div><p role="status" aria-live="polite">{status}{dirty && <span> · {w('unsaved')}</span>}</p></div>
    {preview ? <PersonalPortfolio data={{...data,defaultLanguage:lang}} preview /> : <main className="owner-form">
      <details open><summary>{w('profile')}</summary><div className="owner-fields">{(['name','initials','role','headline','intro','location','about','email','resume','photo','skills'] as const).map(key => field(key,data[key],[key]))}</div></details>
      <details><summary>{w('design')}</summary><div className="layout-picker" role="group" aria-label={w('layout')}>{Object.entries(layouts).map(([key,layout]) => <button key={key} aria-pressed={data.appearance.layout===key} onClick={() => update(['appearance','layout'],key)}><span className={`layout-thumbnail thumb-${key}`} aria-hidden="true"><i/><i/><i/><i/></span><strong>{layout.name[lang]}</strong><small>{layout.description[lang]}</small></button>)}</div><div className="owner-fields"><label>{w('field')}<select value={data.field} onChange={e => update(['field'],e.target.value)}>{Object.keys(themes).map(f => <option key={f} value={f}>{fieldNames[f as keyof typeof fieldNames][lang]}</option>)}</select></label><label>{w('defaultLanguage')}<select value={data.defaultLanguage} onChange={e => update(['defaultLanguage'],e.target.value)}>{['uz','ru','en'].map(l => <option key={l}>{l}</option>)}</select></label>{(['accent','paper'] as const).map(key => <label key={key}>{w(key)}<input type="color" value={data.appearance[key] || themes[data.field][key]} onChange={e => update(['appearance',key],e.target.value)} /><button onClick={() => update(['appearance',key],'')}>↺</button></label>)}<label>{w('font')}<select value={data.appearance.font} onChange={e => update(['appearance','font'],e.target.value)}><option value="">Auto</option><option value="Georgia, serif">Georgia</option><option value="Arial, sans-serif">Arial</option><option value="monospace">Monospace</option></select></label>{(['demo','available'] as const).map(key => <label key={key} className="check-field"><input type="checkbox" checked={data[key]} onChange={e => update([key],e.target.checked)}/>{w(key)}</label>)}</div></details>
      {projectsEditor()}
      {(['experience','links'] as const).map(collection => <details key={collection}><summary>{w(collection)} ({data[collection].length})</summary>{data[collection].map((item,i) => <fieldset key={i}><legend>{i+1}</legend><div className="owner-fields">{Object.entries(item).filter(([key]) => key !== 'id').map(([key,value]) => field(key,value,[collection,i,key]))}</div><div className="item-actions"><button disabled={i===0} aria-label="Move up" onClick={() => {const items=[...data[collection]]; [items[i-1],items[i]]=[items[i],items[i-1]]; update([collection],items);}}>↑</button><button onClick={() => {if(confirm(w('remove')+'?')) update([collection],data[collection].filter((_,j) => j!==i));}}>{w('remove')}</button></div></fieldset>)}<button onClick={() => update([collection],[...data[collection], collection==='experience' ? {period:'',title:blankText(),organization:blankText(),description:blankText()} : {label:'',url:''}])}>{w('add')} +</button></details>)}
      {issues.length > 0 && <aside className="readiness"><strong>{w('check')}</strong><ul>{issues.map(issue => <li key={issue}>{issue}</li>)}</ul></aside>}
    </main>}
  </div>;
}

