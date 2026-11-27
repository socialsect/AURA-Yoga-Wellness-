'use client';

import { useState } from 'react';
import { BASE, OFFERS, SCHEDULE, bookFor } from '../data';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Divider, words } from '../components/ui';
import { useMotion } from '../components/useMotion';

const GOALS = [['new', 'Begin from the start'], ['calm', 'Feel calmer'], ['strong', 'Grow stronger'], ['away', 'Get away for a week']] as const;
const PLACES = [['studio', 'In the studio'], ['online', 'Online'], ['home', 'At my home']] as const;
type Goal = (typeof GOALS)[number][0];
type Place = (typeof PLACES)[number][0];

function match(goal: Goal, place: Place) {
  const card = (id: string, when: string, price: string) => {
    const o = OFFERS.find((x) => x.id === id)!;
    return { id, name: o.name, img: o.img, alt: o.alt, when, price };
  };
  if (goal === 'away') return card('retreat', '8 to 15 February 2027', 'from ₹78,000');
  if (place === 'home') return card('private', '75 minutes, at a time we agree', '₹3,500 a session');
  if (goal === 'new' && place === 'studio') return { id: 'beginners', name: 'Beginners’ course', img: BASE + '/img/pavilion.webp', alt: 'Mats and bolsters ready in a bamboo pavilion', when: 'Saturdays at 8:00 am, four weeks', price: 'Ask for the course fee' };
  if (place === 'studio') return card('group', 'Mon, Wed, Fri at 6:30 am', '₹900 a class');
  return card('online', goal === 'strong' ? 'Thursday slow vinyasa, 7 pm IST' : 'Tuesday yin and restore, 7 pm IST', '₹600 a class');
}

const FILTERS = [['all', 'Everything'], ['studio', 'In the studio'], ['online', 'Online']] as const;

export default function View() {
  const [goal, setGoal] = useState<Goal>('calm');
  const [place, setPlace] = useState<Place>('studio');
  const [filter, setFilter] = useState<string>('all');
  const pick = match(goal, place);
  const week = SCHEDULE.filter(([, , , , where]) => filter === 'all' || where.toLowerCase().includes(filter));

  useMotion((gsap) => {
    gsap.from('.finder-ask > *', { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.2, clearProps: 'all' });
    gsap.fromTo('.finder-card', { clipPath: 'inset(0% 0% 100% 0% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.5, ease: 'expo.inOut', delay: 0.2, clearProps: 'clipPath' });
    // each picture grows from a pill on the outer edge into its full frame
    gsap.utils.toArray<HTMLElement>('.lesson').forEach((el, i) => {
      const from = i % 2 ? 'inset(14% 0% 14% 40% round 999px)' : 'inset(14% 40% 14% 0% round 999px)';
      gsap.fromTo(el.querySelector('.lesson-img'), { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 28%', scrub: 0.8 } });
    });
  });

  return (
    <>
      <Header current="/classes/" />
      <main id="top">
        <section className="finder" aria-labelledby="cl-h">
          <div className="finder-ask">
            <h1 id="cl-h" className="page-h">Find your class</h1>
            <p className="lead">Private, group, online and retreat, from ₹600 a class. Answer two questions.</p>
            <fieldset>
              <legend>What would you like?</legend>
              <div className="chips">
                {GOALS.map(([v, l]) => <label key={v} className="chip"><input type="radio" name="goal" value={v} checked={goal === v} onChange={() => setGoal(v)} /><span>{l}</span></label>)}
              </div>
            </fieldset>
            <fieldset disabled={goal === 'away'}>
              <legend>{goal === 'away' ? 'The retreat is by a lagoon in the Western Ghats' : 'Where will you practise?'}</legend>
              <div className="chips">
                {PLACES.map(([v, l]) => <label key={v} className="chip"><input type="radio" name="place" value={v} checked={place === v} onChange={() => setPlace(v)} /><span>{l}</span></label>)}
              </div>
            </fieldset>
          </div>
          <article className="finder-card" aria-live="polite">
            <img key={pick.img} src={pick.img} alt={pick.alt} />
            <div className="finder-info" key={pick.name + pick.when}>
              <h2>{pick.name}</h2>
              <p>{pick.when}</p>
              <p className="finder-price">{pick.price}</p>
              <a className="btn" href={bookFor(pick.id)}>Book this</a>
            </div>
          </article>
        </section>

        <Divider />
        <section className="lessons" aria-labelledby="all-h">
          <h2 id="all-h" className="split">{words('Every way to practise')}</h2>
          {OFFERS.map((o) => (
            <article className="lesson" id={o.id} key={o.id}>
              <div className="lesson-img"><img src={o.img} alt={o.alt} loading="lazy" /></div>
              <div className="lesson-text" data-rise>
                <h3>{o.name}</h3>
                <p className="offer-line">{o.line}</p>
                <p>{o.desc}</p>
                <dl className="offer-meta">{o.meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                <div className="btn-row"><a className="btn" href={bookFor(o.id)}>Book {o.name.toLowerCase()}</a></div>
              </div>
            </article>
          ))}
        </section>

        <Divider />
        <section id="week" className="week" aria-labelledby="week-h">
          <div className="week-head">
            <h2 id="week-h" className="split">{words('The week')}</h2>
            <div className="chips" role="group" aria-label="Show classes">
              {FILTERS.map(([v, l]) => <button type="button" key={v} className="chip-btn" aria-pressed={filter === v} onClick={() => setFilter(v)}>{l}</button>)}
            </div>
          </div>
          <ul className="sch-list" aria-live="polite">
            {week.map(([, d, t, c, w]) => (
              <li key={d + filter} className="sch-row">
                <span className="sch-day">{d}</span><span className="sch-time">{t}</span><span className="sch-class">{c}</span><span className="sch-where">{w}</span>
              </li>
            ))}
          </ul>
          <p className="week-note">All times are Indian Standard Time. Sunday is a rest day. Online classes are live, and the link arrives an hour before.</p>
        </section>

        <Divider />
        <section className="prices" aria-labelledby="pr-h">
          <h2 id="pr-h" className="split">{words('Prices, plainly')}</h2>
          <ul data-rise>
            {OFFERS.map((o) => (
              <li key={o.id}>
                <a href={bookFor(o.id)}>
                  <span className="price-name">{o.name}</span>
                  <span className="price-len">{o.meta[0][1]}</span>
                  <span className="price-fig">{o.meta[2][1]}</span>
                </a>
              </li>
            ))}
          </ul>
          <p>The four-week beginners’ course runs on Saturdays. Write to Ahana for the course fee and the next start date.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
