'use client';

import { useEffect, useState } from 'react';
import { BASE, BOOK, EMAIL, FAQ, mail } from '../data';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Divider, words } from '../components/ui';
import { useMotion } from '../components/useMotion';

const GROUPS = [
  { name: 'Starting out', img: '/img/studio-namaste.webp', alt: 'A smiling woman sitting cross-legged with palms together', items: [FAQ[0], FAQ[1], FAQ[4]] },
  { name: 'Classes', img: '/img/mat.webp', alt: 'Bare feet and hands on a green yoga mat', items: [
    FAQ[2],
    { q: 'When are the classes?', a: 'Mornings on Monday, Wednesday and Friday at 6:30 am, evenings on Tuesday and Thursday at 7:00 pm, and the beginners’ course on Saturday at 8:00 am. All times are Indian Standard Time.' },
    { q: 'How big is a group class?', a: 'Eight mats at most, so Ahana can see everyone and offer help.' },
    { q: 'Which languages do you teach in?', a: 'English and Tamil.' },
    FAQ[3],
  ] },
  { name: 'Retreat', img: '/img/villa-pool.webp', alt: 'A quiet villa with a long pool among palm trees', items: [
    { q: 'When and where is the retreat?', a: '8 to 15 February 2027, seven nights by a lagoon in the Western Ghats, with twelve guests.' },
    { q: 'What does the retreat price include?', a: 'All meals, classes and airport transfers. Shared rooms are ₹78,000 and single rooms ₹96,000.' },
  ] },
  { name: 'Booking', img: '/img/window-tree.webp', alt: 'Practising at home beside a bright window', items: [
    { q: 'How do I book?', a: 'Fill in the form on the contact page. It writes an email for you, and you press send. Ahana replies within a day.' },
    { q: 'What does a class cost?', a: 'Private sessions are ₹3,500, small group mornings ₹900 and live online classes ₹600.' },
  ] },
];

export default function View() {
  const [open, setOpen] = useState('');
  const [query, setQuery] = useState('');
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [rounds, setRounds] = useState(0);

  // four counts in, six counts out
  useEffect(() => {
    if (!breathing) return;
    const t = setTimeout(() => {
      if (phase === 'out') setRounds((r) => r + 1);
      setPhase(phase === 'in' ? 'out' : 'in');
    }, phase === 'in' ? 4000 : 6000);
    return () => clearTimeout(t);
  }, [breathing, phase]);

  const toggle = () => { setBreathing(!breathing); setPhase('in'); setRounds(0); };

  useMotion((gsap) => {
    gsap.from('.breath', { scale: 0.6, opacity: 0, duration: 1.8, ease: 'expo.out', delay: 0.1 });
    gsap.from('.faq-intro > *', { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.25 });
    gsap.utils.toArray<HTMLElement>('.faq-group').forEach((g) => {
      gsap.from(g.querySelectorAll('.q-item'), { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform,opacity', scrollTrigger: { trigger: g, start: 'top 85%', once: true } });
    });
  });

  const needle = query.trim().toLowerCase();
  const shown = GROUPS.map((g) => ({ ...g, items: g.items.filter((f) => !needle || `${f.q} ${f.a}`.toLowerCase().includes(needle)) })).filter((g) => g.items.length);
  const count = shown.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <Header current="/faq/" />
      <main id="top">
        <section className="faq-hero" aria-labelledby="faq-h">
          <div className="faq-intro">
            <h1 id="faq-h" className="page-h">Ask anything</h1>
            <p className="lead">Take one slow breath with the circle, then find your answer below.</p>
            <label className="search">
              <span>Search the questions</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “online” or “retreat”" />
            </label>
            <p className="search-count" role="status">{needle ? `${count} ${count === 1 ? 'answer' : 'answers'} found` : ''}</p>
          </div>
          <div className={`breath${breathing ? ` run ${phase}` : ''}`}>
            <span className="breath-ring" aria-hidden="true" />
            <span className="breath-ring" aria-hidden="true" />
            <button type="button" onClick={toggle} aria-pressed={breathing}>
              <strong aria-live="polite">{breathing ? (phase === 'in' ? 'Breathe in' : 'Breathe out') : 'Breathe with me'}</strong>
              <small>{breathing ? (rounds ? `${rounds} ${rounds === 1 ? 'round' : 'rounds'}. Tap to stop` : 'Tap to stop') : 'Four counts in, six out'}</small>
            </button>
          </div>
        </section>

        <Divider />
        <div className="faq-body">
          {shown.map((g) => (
            <section className="faq-group" key={g.name} aria-label={g.name}>
              <div className="faq-side"><h2>{g.name}</h2><figure data-wipe><img src={BASE + g.img} alt={g.alt} loading="lazy" /></figure></div>
              <ul className="q-list">
                {g.items.map((f) => {
                  const on = open === f.q;
                  const id = 'a-' + f.q.replace(/\W+/g, '-').toLowerCase();
                  return (
                    <li className={`q-item${on ? ' open' : ''}`} key={f.q}>
                      <button type="button" aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? '' : f.q)}>
                        <span>{f.q}</span><span className="plus" aria-hidden="true" />
                      </button>
                      <div className="q-a" id={id} inert={!on}><div><p>{f.a}</p></div></div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {!count && (
            <div className="faq-empty">
              <h2>No answer for that yet</h2>
              <p>Ask Ahana directly. She replies within a day.</p>
              <div className="btn-row">
                <a className="btn" href={mail('A question', `Hello Ahana,\n\nMy question: ${query}\n\n`)}>Email {EMAIL}</a>
                <button type="button" className="chip-btn" onClick={() => setQuery('')}>Clear the search</button>
              </div>
            </div>
          )}
        </div>

        <section className="invite" aria-labelledby="fs-h">
          <figure data-drift><img src={BASE + '/img/pool-light.webp'} alt="Sunlight and leaf shadows on clear pool water" loading="lazy" /></figure>
          <div className="invite-card" data-rise>
            <h2 id="fs-h">{words('Still unsure?')}</h2>
            <p>Write a few lines about how you feel and what you want. That is enough to begin.</p>
            <div className="btn-row"><a className="btn" href={BOOK}>Write to Ahana</a></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
