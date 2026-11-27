'use client';

import { BASE, BOOK, url } from '../data';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Divider, words } from '../components/ui';
import { useMotion } from '../components/useMotion';

const WAYS = [
  { h: 'Breath before shape', p: 'A pose counts when the breath stays long inside it. If the breath turns short, we come back a step.', img: '/img/curtains.webp', alt: 'A woman sitting in meditation between white curtains' },
  { h: 'Slow enough to notice', p: 'We hold, rest and repeat. You learn what your knees, hips and shoulders are telling you today.', img: '/img/garden-path.webp', alt: 'A woman stretching on a flowering garden path' },
  { h: 'Eight mats at most', p: 'Small rooms, always. Every cue is meant for someone in the room, and you can ask for help at any point.', img: '/img/assist.webp', alt: 'A teacher gently guiding a student into triangle pose' },
];

const TRAINING = [
  ['Hatha', 'Trained in Mysore and Rishikesh', 'The base of every morning class: steady standing poses, long breathing, a full rest.'],
  ['Vinyasa', 'Trained in Mysore and Rishikesh', 'Slow, linked movement, one breath to one step, for strength without hurry.'],
  ['Yin and restorative', 'Further training', 'Quiet floor poses held with cushions and blankets, for tired and anxious weeks.'],
];

export default function View() {
  useMotion((gsap) => {
    // first light: the sun climbs behind her while the window opens
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.dawn', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    tl.fromTo('.dawn-sun', { yPercent: 55, scale: 0.55 }, { yPercent: -18, scale: 1, duration: 1 }, 0)
      .fromTo('.dawn-sky', { opacity: 1 }, { opacity: 0, duration: 1 }, 0)
      .fromTo('.dawn-window', { clipPath: 'inset(18% 20% 0% 20% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)', duration: 0.8 }, 0)
      .fromTo('.dawn-window img', { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
      .to('.dawn-l', { xPercent: -5, duration: 1 }, 0)
      .to('.dawn-r', { xPercent: 5, duration: 1 }, 0);
    // the picture beside each way of teaching opens from a circle
    gsap.utils.toArray<HTMLElement>('.way-img').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'circle(18% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'center 52%', scrub: true } });
    });
  });

  return (
    <>
      <Header current="/about/" />
      <main id="top">
        <section className="dawn" aria-labelledby="about-h">
          <div className="dawn-stage">
            <span className="dawn-sky" aria-hidden="true" />
            <span className="dawn-sun" aria-hidden="true" />
            <h1 id="about-h" className="dawn-title">
              <span className="dawn-l"><span className="dawn-mask"><span className="dawn-word">Meet</span></span></span>{' '}
              <span className="dawn-r"><span className="dawn-mask"><span className="dawn-word">Ahana</span></span></span>
            </h1>
            <p className="dawn-sub">Yoga teacher since 2012. Hatha, vinyasa and yin, in English and Tamil.</p>
            <figure className="dawn-window">
              <img src={BASE + '/img/studio-calm.webp'} width={1600} height={1067} alt="Ahana sitting cross-legged with palms together in a bright, quiet studio" />
            </figure>
          </div>
        </section>

        <section className="origin" aria-label="Her story">
          <p className="big-say split">{words('Ahana means the first light of the sun.')}</p>
          <div className="origin-text" data-rise>
            <p className="lead">She has taught yoga since 2012: slow, clear classes built on the breath rather than on how a pose looks.</p>
            <p>Most students come to her stiff, tired or anxious. They stay because they leave each class feeling more like themselves. Classes are in English and Tamil, in the studio, at your home, online and on a yearly retreat.</p>
          </div>
        </section>

        <Divider />
        <section className="ways" aria-labelledby="ways-h">
          <h2 id="ways-h" className="split">{words('How she teaches')}</h2>
          {WAYS.map((w) => (
            <article className="way" key={w.h}>
              <div className="way-img"><img src={BASE + w.img} alt={w.alt} loading="lazy" /></div>
              <div className="way-text" data-rise>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </div>
            </article>
          ))}
        </section>

        <Divider />
        <section className="training" aria-labelledby="tr-h">
          <div className="training-head">
            <h2 id="tr-h" className="split">{words('Where it comes from')}</h2>
            <figure data-wipe data-drift><img src={BASE + '/img/pavilion.webp'} alt="Mats and pale blue bolsters laid out in a bamboo pavilion" loading="lazy" /></figure>
          </div>
          <ul className="training-list" data-rise>
            {TRAINING.map(([style, where, what]) => (
              <li key={style}>
                <h3>{style}</h3>
                <p className="training-where">{where}</p>
                <p>{what}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="invite" aria-labelledby="inv-h">
          <figure data-drift><img src={BASE + '/img/beach-group.webp'} alt="A small group holding tree pose together on a misty beach" loading="lazy" /></figure>
          <div className="invite-card" data-rise>
            <h2 id="inv-h">Practise with her</h2>
            <p>Start with one private session, or come to a morning class.</p>
            <div className="btn-row"><a className="btn" href={BOOK}>Book a first class</a><a className="tlink" href={url('/classes/')}>See classes and prices</a></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
