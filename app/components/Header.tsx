'use client';

import { useEffect, useState } from 'react';
import { BOOK, EMAIL, mail, url } from '../data';

export const LINKS = [
  ['About', '/about/'],
  ['Classes', '/classes/'],
  ['Retreat', '/retreat/'],
  ['Questions', '/faq/'],
  ['Contact', '/contact/'],
] as const;

export default function Header({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const behind = Array.from(document.querySelectorAll<HTMLElement>('main, .foot'));
    root.classList.add('menu-open');
    behind.forEach((el) => (el.inert = true));
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      document.querySelector<HTMLElement>('.menu-btn')?.focus();
    };
    const wide = window.matchMedia('(min-width: 1081px)');
    const close = () => { if (wide.matches) setOpen(false); };
    window.addEventListener('keydown', key);
    wide.addEventListener('change', close);
    return () => {
      root.classList.remove('menu-open');
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener('keydown', key);
      wide.removeEventListener('change', close);
    };
  }, [open]);

  return (
    <>
      <header className="nav">
        <a href={url('/')} className="wordmark">Ahana Mehra</a>
        <nav aria-label="Main">
          {LINKS.map(([label, path]) => <a key={path} href={url(path)} aria-current={current === path ? 'page' : undefined}>{label}</a>)}
        </nav>
        <div className="nav-end">
          <a href={BOOK} className="btn btn-sm">Book a class</a>
          <button type="button" className="menu-btn" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            <span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </div>
      </header>
      <div id="menu" className={`menu${open ? ' open' : ''}`} inert={!open} data-lenis-prevent>
        <nav aria-label="Menu">
          {([['Home', '/'], ...LINKS] as const).map(([label, path], i) => (
            <a key={path} href={url(path)} style={{ transitionDelay: open ? `${0.12 + i * 0.05}s` : '0s' }} aria-current={current === path ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
        <div className="menu-foot">
          <a className="btn btn-ink" href={BOOK}>Book a first class</a>
          <a className="menu-mail" href={mail('Hello', 'Hello Ahana,\n\n')}>{EMAIL}</a>
        </div>
      </div>
    </>
  );
}
