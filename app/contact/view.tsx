'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BASE, EMAIL, mail, url } from '../data';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Divider, words } from '../components/ui';
import { useMotion } from '../components/useMotion';

const CLASSES = [
  ['private', 'a private session'], ['group', 'a small group morning'], ['online', 'a live online class'],
  ['beginners', 'the beginners’ course'], ['retreat', 'a place on the retreat'], ['unsure', 'your advice on where to start'],
] as const;
const TIMES = ['weekday mornings', 'weekday evenings', 'Saturday mornings', 'any time that suits you'];
const LEVELS = ['I am new to yoga', 'I have practised a little', 'I practise often'];

type Form = { name: string; reply: string; kind: string; room: string; time: string; level: string; note: string };
type Errors = Partial<Record<'name' | 'reply' | 'kind', string>>;

export default function View() {
  const [f, setF] = useState<Form>({ name: '', reply: '', kind: '', room: 'shared', time: TIMES[0], level: LEVELS[0], note: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState('');
  const [copied, setCopied] = useState<'' | 'yes' | 'no'>('');

  // the buttons around the site arrive here with the class already chosen
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const kind = q.get('class') ?? '';
    const room = q.get('room') === 'single' ? 'single' : 'shared';
    if (CLASSES.some(([v]) => v === kind)) setF((s) => ({ ...s, kind, room }));
  }, []);

  useMotion((gsap) => {
    gsap.from('.letter-head > *', { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.1 });
    gsap.from('.letter', { y: 90, rotate: 1.6, opacity: 0, duration: 1.5, ease: 'expo.out', delay: 0.25, clearProps: 'all' });
  });

  const set = (k: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setF((s) => ({ ...s, [k]: value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
    setSent('');
  };
  const retreat = f.kind === 'retreat';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const reply = f.reply.trim();
    const x: Errors = {};
    if (!f.name.trim()) x.name = 'Please add your name.';
    if (!f.kind) x.kind = 'Choose what you would like to book.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply) && !/^\+?[\d\s()-]{8,}$/.test(reply)) x.reply = 'Add an email address or a phone number so Ahana can reply.';
    setErrors(x);
    const first = (['name', 'kind', 'reply'] as const).find((k) => x[k]);
    if (first) { document.getElementById('f-' + first)?.focus(); return; }
    const what = CLASSES.find(([v]) => v === f.kind)![1];
    const body = [
      'Hello Ahana,', '',
      `My name is ${f.name.trim()} and I would like ${what}.`,
      retreat ? `Room: ${f.room}.` : `I can come on ${f.time}.`,
      `${f.level}.`,
      ...(f.note.trim() ? ['', f.note.trim()] : []),
      '', `You can reach me at ${reply}.`, '', 'Thank you,', f.name.trim(),
    ].join('\n');
    setSent(body);
    setCopied('');
    window.location.href = mail(`Booking request from ${f.name.trim()}`, body);
  };

  const copy = () => {
    if (!navigator.clipboard) { setCopied('no'); return; }
    navigator.clipboard.writeText(`To: ${EMAIL}\n\n${sent}`).then(() => setCopied('yes'), () => setCopied('no'));
  };
  const field = (k: keyof Errors) => ({ id: 'f-' + k, 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  return (
    <>
      <Header current="/contact/" />
      <main id="top">
        <section className="write" aria-labelledby="ct-h">
          <div className="letter-head">
            <h1 id="ct-h" className="page-h">Write to Ahana</h1>
            <p className="lead">Fill in the blanks. The letter becomes an email in your own mail app, and she replies within a day.</p>
            <figure><img src={BASE + '/img/mudra.webp'} alt="A hand resting in a mudra on a knee, in soft light" /></figure>
          </div>

          <form className="letter" onSubmit={submit} noValidate>
            <p className="letter-hi">Hello Ahana,</p>
            <div className="line">
              <label htmlFor="f-name">My name is</label>
              <input {...field('name')} value={f.name} onChange={set('name')} autoComplete="name" placeholder="your name" required />
            </div>
            {errors.name && <p className="field-error" id="e-name">{errors.name}</p>}
            <div className="line">
              <label htmlFor="f-kind">and I would like</label>
              <select {...field('kind')} value={f.kind} onChange={set('kind')} required>
                <option value="" disabled>choose one</option>
                {CLASSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            {errors.kind && <p className="field-error" id="e-kind">{errors.kind}</p>}
            {retreat ? (
              <div className="line">
                <label htmlFor="f-room">in a</label>
                <select id="f-room" value={f.room} onChange={set('room')}><option value="shared">shared room, ₹78,000</option><option value="single">single room, ₹96,000</option></select>
              </div>
            ) : (
              <div className="line">
                <label htmlFor="f-time">I can come on</label>
                <select id="f-time" value={f.time} onChange={set('time')}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select>
              </div>
            )}
            <fieldset>
              <legend>About my practice</legend>
              <div className="chips">
                {LEVELS.map((l) => <label key={l} className="chip"><input type="radio" name="level" value={l} checked={f.level === l} onChange={set('level')} /><span>{l}</span></label>)}
              </div>
            </fieldset>
            <div className="line block">
              <label htmlFor="f-note">Something you should know (optional)</label>
              <textarea id="f-note" rows={3} value={f.note} onChange={set('note')} placeholder="An injury, pregnancy, sleep, stress" />
            </div>
            <div className="line">
              <label htmlFor="f-reply">You can reach me at</label>
              <input {...field('reply')} value={f.reply} onChange={set('reply')} autoComplete="email" placeholder="email or phone" required />
            </div>
            {errors.reply && <p className="field-error" id="e-reply">{errors.reply}</p>}
            <button type="submit" className="btn">Open my email to send</button>
            <div role="status">
              {sent && (
                <div className="sent">
                  <p><strong>Your letter is ready.</strong> Press send in your email app. Nothing is sent from this page.</p>
                  <p>No email app opened? Copy the letter and send it to {EMAIL}.</p>
                  <button type="button" className="chip-btn" onClick={copy}>{copied === 'yes' ? 'Copied' : 'Copy the letter'}</button>
                  {copied === 'no' && <textarea readOnly rows={8} value={`To: ${EMAIL}\n\n${sent}`} aria-label="Your letter, ready to copy" onFocus={(e) => e.target.select()} />}
                </div>
              )}
            </div>
          </form>
        </section>

        <Divider />
        <section className="reach" aria-labelledby="re-h">
          <h2 id="re-h" className="split">{words('Other ways in')}</h2>
          <figure className="reach-photo" data-wipe data-drift><img src={BASE + '/img/studio-namaste.webp'} alt="A smiling woman sitting cross-legged with palms together in a bright room" loading="lazy" /></figure>
          <div data-rise><img src={BASE + '/img/pool-light.webp'} alt="Sunlight on clear pool water" loading="lazy" /><h3>Email</h3><p><a className="tlink" href={mail('Hello', 'Hello Ahana,\n\n')}>{EMAIL}</a></p><p>A reply within a day.</p></div>
          <div data-rise><img src={BASE + '/img/mat.webp'} alt="Bare feet and hands on a green yoga mat" loading="lazy" /><h3>Class times</h3><p>Mon, Wed, Fri at 6:30 am</p><p>Tue, Thu at 7:00 pm</p><p>Saturday at 8:00 am</p></div>
          <div data-rise><img src={BASE + '/img/pavilion.webp'} alt="Mats and bolsters laid out in a bamboo pavilion" loading="lazy" /><h3>Before you come</h3><p>Comfortable clothes and water. Mats and blankets are at the studio.</p><p><a className="tlink" href={url('/faq/')}>Read the questions</a></p></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
