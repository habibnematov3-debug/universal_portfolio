'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import { themes, ui, type Language, type Translation } from '../portfolio-content';
import { publishedPortfolio } from '../published-portfolio';
import { safeLink, safeImage, textOnColor, type PortfolioData } from '../lib/portfolio-model';

const languages: Language[] = ['uz', 'ru', 'en'];
export default function PersonalPortfolio({ data: p = publishedPortfolio, preview = false }: { data?: PortfolioData; preview?: boolean }) {
  const [lang, setLang] = useState<Language>(p.defaultLanguage);
  useEffect(() => {
    const sync = () => {
      const query = new URLSearchParams(location.search).get('lang');
      if (preview) { setLang(p.defaultLanguage); return; }
      let saved: string | null = null;
      try { saved = localStorage.getItem('portfolio-language'); } catch {}
      const next = query || saved || p.defaultLanguage;
      setLang(languages.includes(next as Language) ? next as Language : p.defaultLanguage);
    };
    sync(); window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [p.defaultLanguage, preview]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${p.name[lang]} — ${p.role[lang]}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', p.intro[lang]);
  }, [lang, p.name, p.role, p.intro]);
  function changeLanguage(next: Language) {
    setLang(next);
    if (preview) return;
    try { localStorage.setItem('portfolio-language', next); } catch {}
    const url = new URL(location.href); url.searchParams.set('lang', next);
    history.replaceState(null, '', url);
  }
  const t = (text: Translation) => text[lang];
  const theme = themes[p.field];
  const ink = textOnColor(p.appearance.paper || theme.paper);
  const style = { '--accent': p.appearance.accent || theme.accent, '--paper': p.appearance.paper || theme.paper,
    '--on-accent': textOnColor(p.appearance.accent || theme.accent), '--ink': ink,
    '--muted': ink === '#ffffff' ? '#c5ccc5' : '#5c665f', '--line': ink === '#ffffff' ? '#ffffff40' : '#253c2824',
    ...(p.appearance.font ? { '--heading-font': p.appearance.font } : {}) } as CSSProperties;
  return <div className={`personal theme-${theme.style}`} style={style} id="top">
    <a className="skip-link" href="#main">{t(ui.skip)}</a>
    {p.demo && <div className="demo-note">{t(ui.demo)}</div>}
    <header className="personal-header">
      <a className="identity" href="#top"><span className="monogram">{p.initials}<i /></span><span>{t(p.name)}</span></a>
      <nav aria-label={t(ui.work)}><a href="#work">{t(ui.work)}</a><a href="#about">{t(ui.about)}</a><a href="#contact">{t(ui.contact)} ↗</a></nav>
      <div className="language-switch" role="group" aria-label={t(ui.language)}>{languages.map(l => <button key={l} lang={l} aria-label={{ uz: 'O‘zbekcha', ru: 'Русский', en: 'English' }[l]} aria-pressed={l === lang} onClick={() => changeLanguage(l)}>{l === 'en' ? 'ENG' : l.toUpperCase()}</button>)}</div>
    </header>
    <main id="main">
      <section className="personal-hero">
        <div className="hero-text"><div className="overline">{t(p.role)}</div><h1>{t(p.headline)}</h1><p>{t(p.intro)}</p><div className="hero-links"><a className="solid-link" href="#work">{t(ui.viewWork)} <span>↗</span></a>{safeLink(p.resume) && <a href={safeLink(p.resume)} target="_blank" rel="noreferrer">{t(ui.resume)} ↓</a>}</div><div className="availability">{p.available && <><i />{t(ui.available)}<span> / </span></>}{t(p.location)}</div></div>
        <div className="hero-object">{safeImage(p.photo) ? <img className="owner-photo" src={safeImage(p.photo)} alt={t(p.name)} /> : <div className="sculpture" aria-hidden="true"><div className="grid-plane"/><div className="sculpture-ring ring-one"/><div className="sculpture-ring ring-two"/><div className="sculpture-ring ring-three"/><span className="object-cross">+</span></div>}<div className="object-caption"><span>01 / {t(p.name)}</span><span>PORTFOLIO ↗</span></div></div>
      </section>
      <section id="work" className="work-section"><div className="section-heading"><div><span className="overline">01 / {t(ui.work)}</span><h2>{t(ui.selected)}<sup>({String(p.projects.length).padStart(2, '0')})</sup></h2></div><p>{t(ui.workIntro)}</p></div>
        <div className="work-grid">{p.projects.map((project, index) => <article className="work-card" key={project.id}>
          <div className={`project-image project-art-${index % 2}`}>
            {safeImage(project.image) ? <img src={safeImage(project.image)} alt={t(project.title)} loading="lazy" /> : <div className="project-composition" aria-hidden="true"><div className="mock-window"><div className="mock-bar"><i/><i/><i/></div><div className="mock-body"><div className="mock-sidebar"/><div className="mock-content"><div className="mock-line"/><div className="mock-line short"/><div className="mock-tiles"><i/><i/><i/></div><div className="mock-line"/></div></div></div><span className="art-number">{project.id}</span></div>}
            <span className="project-year">{project.year}</span>
          </div><div className="project-heading"><div><span className="overline">{t(project.category)}</span><h3>{t(project.title)}</h3></div><span aria-hidden="true">↗</span></div><p>{t(project.summary)}</p><div className="skill-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          <details><summary>{t(ui.details)} <span>+</span></summary><div className="project-details"><h4>{t(ui.contribution)}</h4><p>{t(project.contribution)}</p><h4>{t(ui.result)}</h4><p>{t(project.result)}</p>{safeLink(project.url) && <a className="inline-link" href={safeLink(project.url)} target="_blank" rel="noreferrer">{t(ui.visit)} ↗</a>}</div></details>
        </article>)}</div>
      </section>
      <section id="about" className="about-section"><div><span className="overline">02 / {t(ui.about)}</span><h2>{t(ui.about)}<span className="accent-dot">.</span></h2></div><div><p className="about-copy">{t(p.about)}</p><h3 className="overline">{t(ui.skills)}</h3><div className="skill-list large">{p.skills.map(skill => <span key={skill}>{skill}</span>)}</div><h3 className="overline journey-label">{t(ui.journey)}</h3>{p.experience.map((item, i) => <div className="journey-item" key={i}><span>{item.period}</span><div><h3>{t(item.title)}</h3><strong>{t(item.organization)}</strong><p>{t(item.description)}</p></div></div>)}</div></section>
      <section id="contact" className="contact-section"><span className="overline">03 / {t(ui.contact)}</span><h2>{t(ui.together)}</h2>{p.email ? <a className="contact-email" href={`mailto:${p.email}`}>{p.email} ↗</a> : <p>{t(ui.noContact)}</p>}<div className="social-links">{p.links.filter(link => safeLink(link.url)).map(link => <a key={link.url} href={safeLink(link.url)} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></section>
    </main><footer className="personal-footer"><span>© {new Date().getFullYear()} {t(p.name)}</span><span>{t(p.location)}</span><a href="#top">{t(ui.top)} ↑</a></footer>
  </div>;
}
