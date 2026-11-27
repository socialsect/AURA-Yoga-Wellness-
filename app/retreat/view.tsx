'use client';

import { useEffect, useState } from 'react';
import { BASE, MORNINGS, bookFor } from '../data';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Divider, words } from '../components/ui';
import { useMotion } from '../components/useMotion';

const DAY = [
  { t: '6:00 am', h: 'First light practice', p: 'Breathing and a slow flow while the mist is still on the water.', img: '/img/water-deck.webp', alt: 'A group practising in an open pavilion above a river' },
  { t: '8:30 am', h: 'Breakfast together', p: 'Warm porridge, fruit and tea, with no hurry to leave the table.', img: '/img/breakfast.webp', alt: 'Two bowls of porridge with fresh fruit' },
  { t: '11:00 am', h: 'Swim or silence', p: 'The pool, a book or a long quiet hour. Nothing is compulsory.', img: '/img/pool-light.webp', alt: 'Sunlight and leaf shadows on clear pool water' },
  { t: '5:00 pm', h: 'Evening practice', p: 'Floor poses held with cushions as the heat leaves the day.', img: '/img/pavilion.webp', alt: 'Mats and bolsters laid out in a bamboo pavilion' },
  { t: '7:30 pm', h: 'Supper and an early night', p: 'Simple vegetarian food, then lamps low and an early bed.', img: '/img/villa-garden.webp', alt: 'A garden villa with a green pool and palms' },
];

const ROOMS = [
  { id: 'shared', name: 'Shared room', price: '₹78,000', line: 'Two guests, a bed each', img: '/img/villa-garden.webp' },
  { id: 'single', name: 'Single room', price: '₹96,000', line: 'A room to yourself', img: '/img/villa-pool.webp' },
];

export default function View() {
  const [room, setRoom] = useState(ROOMS[0]);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    // whole days until the first morning, counted in Indian time
    const today = Math.floor((Date.now() + 5.5 * 3600000) / 86400000);
    setDays(Math.round(Date.UTC(2027, 1, 8) / 86400000) - today);
  }, []);

  useMotion((gsap, ScrollTrigger, { mobile }) => {
    // the water opens from a circle to the whole screen
    const tide = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.tide', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    tide.fromTo('.tide-photo', { clipPath: mobile ? 'circle(34% at 50% 74%)' : 'circle(16% at 50% 76%)' }, { clipPath: 'circle(125% at 50% 55%)', duration: 1, ease: 'power1.in' }, 0)
      .fromTo('.tide-photo img', { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
      .to('.tide-head', { yPercent: -20, duration: 1 }, 0)
      .to('.tide-head', { autoAlpha: 0, duration: 0.25 }, 0.3)
      .fromTo('.tide-shade', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.5)
      .fromTo('.tide-over', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
      .to({}, { duration: 0.2 });
    gsap.from('.tide-head > *', { y: 40, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1, delay: 0.2 });

    // one day by the water: the sun crosses the sky and the hours change with it
    const day = document.querySelector<HTMLElement>('.oneday')!;
    day.classList.add('live');
    const steps = gsap.utils.toArray<HTMLElement>('.hour');
    const sun = day.querySelector<HTMLElement>('.arc-sun')!;
    const set = (p: number) => {
      const i = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach((s, k) => s.classList.toggle('on', k === i));
      day.dataset.hour = String(i);
      // the sun sits on the same curve the sky line is drawn with
      sun.style.left = `${p * 100}%`;
      sun.style.top = `${100 - 4 * p * (1 - p) * 100}%`;
    };
    set(0);
    ScrollTrigger.create({ trigger: day, start: 'top top', end: 'bottom bottom', onUpdate: (s) => set(s.progress) });

    gsap.utils.toArray<HTMLElement>('.dawns figure').forEach((f, i) => {
      gsap.fromTo(f, { y: 50 + (i % 4) * 45 }, { y: 0, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'top 50%', scrub: 0.8 } });
    });
  });

  return (
    <>
      <Header current="/retreat/" />
      <main id="top">
        <section className="tide" aria-labelledby="rt-h">
          <div className="tide-stage">
            <div className="tide-head">
              <h1 id="rt-h" className="page-h">Seven mornings by the water</h1>
              <p className="lead">8 to 15 February 2027. Twelve guests at a lagoon in the Western Ghats.</p>
              <p className="tide-count">{days !== null && days > 0 ? `${days} ${days === 1 ? 'day' : 'days'} until the first morning` : 'Sunrise practice, long silences, early nights'}</p>
            </div>
            <div className="tide-photo">
              <img src={BASE + '/img/water-deck.webp'} alt="A group practising in an open pavilion above calm water" />
              <span className="tide-shade" aria-hidden="true" />
              <div className="tide-over"><p>Two classes a day, swims and simple vegetarian food.</p><a className="btn" href={bookFor('retreat')}>Reserve a place</a></div>
            </div>
          </div>
        </section>

        <Divider />
        <section className="oneday" aria-labelledby="day-h">
          <div className="oneday-stage">
            <h2 id="day-h">One day there</h2>
            <div className="arc" aria-hidden="true">
              {/* a parabola, matching the sun's path */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 Q 50 -100 100 100" /></svg>
              <span className="arc-sun" />
            </div>
            <ol className="hours">
              {DAY.map((d) => (
                <li className="hour" key={d.t}>
                  <img src={BASE + d.img} alt={d.alt} loading="lazy" />
                  <div>
                    <p className="hour-t">{d.t}</p>
                    <h3>{d.h}</h3>
                    <p>{d.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Divider />
        <section className="dawns" aria-labelledby="dw-h">
          <h2 id="dw-h" className="split">{words('Each day has a word')}</h2>
          <div className="dawns-grid">
            {MORNINGS.map((m) => (
              <figure key={m.word}>
                <div className="m-img"><img src={m.img} alt={m.alt} loading="lazy" /></div>
                <figcaption><span className="m-word">{m.word}</span><span>{m.line}</span><span className="m-day">{m.day}</span></figcaption>
              </figure>
            ))}
            <div className="dawns-last">
              <p className="lead">Monday 15 February: breakfast, goodbyes and your ride to the airport.</p>
            </div>
          </div>
        </section>

        <Divider />
        <section className="rooms" aria-labelledby="rm-h">
          <div className="rooms-photo" data-wipe><img key={room.img} src={BASE + room.img} alt="The retreat villa, its garden and pool" loading="lazy" /></div>
          <div className="rooms-text">
            <h2 id="rm-h" className="split">{words('Choose your room')}</h2>
            <fieldset className="room-pick">
              <legend className="visually-hidden">Room</legend>
              {ROOMS.map((r) => (
                <label key={r.id} className="room">
                  <input type="radio" name="room" checked={room.id === r.id} onChange={() => setRoom(r)} />
                  <span><strong>{r.name}</strong><em>{r.line}</em><b>{r.price}</b></span>
                </label>
              ))}
            </fieldset>
            <ul className="included" aria-label="Included" data-rise>
              <li>Seven nights</li><li>All meals</li><li>Two classes a day</li><li>Airport transfers</li>
            </ul>
            <div className="btn-row"><a className="btn btn-ink" href={`${bookFor('retreat')}&room=${room.id}`}>Reserve a {room.name.toLowerCase()}</a></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
