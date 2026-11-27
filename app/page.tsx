'use client';

import { useEffect, useRef, useState } from 'react';
import { BASE, BOOK, FAQ, MORNINGS, OFFERS, SCHEDULE, bookFor, url } from './data';
import Header from './components/Header';
import Footer from './components/Footer';

const STATEMENT =
  'I teach yoga for people who want to feel calmer, stronger and more at home in their own bodies, one slow breath at a time.';

const PHASES = ['Arrive', 'Balance', 'Gratitude'];
const CHAPTERS = [
  { h: 'Arrive in your body', p: 'Every class begins standing still. Feel the feet, let the breath slow down, notice where you are.' },
  { h: 'Find your balance', p: 'Strength and softness in the same pose. We build both, slowly, so they stay with you.' },
  { h: 'Return with gratitude', p: 'Hands to the heart. Carry the calm off the mat and into the rest of your day.' },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(0);
  const [today, setToday] = useState(-1);

  useEffect(() => {
    setToday(new Date(Date.now() + 5.5 * 3600000).getUTCDay());
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 768;
    const N = mobile ? 150 : 300;
    const dir = BASE + (mobile ? '/frames/m/f' : '/frames/d/f');
    const frames: (HTMLImageElement | null)[] = new Array(N).fill(null);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    let cur = 0, target = 0, drawn = -1, alive = true;
    let cleanup: (() => void) | undefined;
    let navCheck: (() => void) | null = null;

    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.6);
      const w = Math.round(canvas.clientWidth * d), h = Math.round(canvas.clientHeight * d);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      drawn = -1;
    };
    const nearest = (i: number) => {
      for (let o = 0; o < N; o++) {
        if (frames[i - o]) return frames[i - o]!;
        if (frames[i + o]) return frames[i + o]!;
      }
      return null;
    };
    const draw = (i: number) => {
      const img = nearest(i);
      if (!img) return;
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };
    size();
    window.addEventListener('resize', size);
    const IDLE = mobile ? 14 : 28;
    let idle = true;
    // framing of the opening still, driven by the same smoothed frame value as the film,
    // so the zoom and the footage always move together
    let frame: ((c: number) => void) | null = null;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      cur += (target - cur) * (reduced ? 1 : idle ? 0.08 : 0.16);
      const i = Math.round(cur);
      if (i !== drawn) { draw(i); if (frames[i]) drawn = i; }
      frame?.(cur);
    };
    loop();

    // frames: key frames first, then fill in, so scrubbing works almost at once
    const order: number[] = [];
    const seen = new Set<number>();
    // the opening stretch loads in order first, so the first scroll never skips frames
    for (let i = 0; i < Math.min(N, IDLE * 3); i++) { seen.add(i); order.push(i); }
    for (const step of [24, 12, 6, 3, 1]) for (let i = 0; i < N; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    const keyCount = Math.ceil(N / 6) + 1;
    let loaded = 0, next = 0, ready = false;
    const markReady = () => { if (ready) return; ready = true; cueRef.current?.classList.add('done'); };
    const pump = () => {
      if (!alive || next >= order.length) return;
      const idx = order[next++];
      const img = new Image();
      img.decoding = 'async';
      img.src = `${dir}${String(idx + 1).padStart(3, '0')}.webp`;
      img.decode().then(() => {
        frames[idx] = img;
        loaded++;
        if (idx === 0) drawn = -1;
        if (countRef.current && !ready) countRef.current.textContent = String(Math.min(100, Math.round((loaded / keyCount) * 100)));
        if (loaded >= keyCount) markReady();
        pump();
      }, () => { loaded++; pump(); });
    };
    for (let k = 0; k < 8; k++) pump();
    const failsafe = setTimeout(markReady, 6000);

    (async () => {
      const [gsapMod, stMod, lenisMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
      if (!alive) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      let lenis: any = null;
      if (!reduced && !navigator.webdriver) {
        lenis = new lenisMod.default({ duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4), smoothWheel: true, wheelMultiplier: 0.75, touchMultiplier: 1.1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t: number) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href')!;
          const el = id.length > 1 ? document.querySelector(id) : document.body;
          if (!el) return;
          e.preventDefault();
          if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.8 });
          else (el as HTMLElement).scrollIntoView();
        }),
      );
      // a plain scroll check, so the header can never be left see-through further down the page
      navCheck = () => {
        const film = document.querySelector<HTMLElement>('#film')!;
        document.querySelector('.nav')?.classList.toggle('solid', window.scrollY >= (film.offsetHeight - window.innerHeight) * 0.85);
      };
      window.addEventListener('scroll', navCheck, { passive: true });
      navCheck();

      // ---------- 1. the film: breathe in, three phases, breathe out ----------
      const stage = document.querySelector<HTMLElement>('.film-stage')!;
      // the opening is the whole scene, full-bleed, with the name set across the foot like a title card
      const fullClip = 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)';
      const endClip = () => {
        const vw = window.innerWidth, vh = window.innerHeight;
        return mobile
          ? `inset(${Math.max(vh * 0.12, 90)}px ${vw * 0.04}px ${vh * 0.3}px ${vw * 0.04}px round 28px 28px 28px 28px)`
          : `inset(${Math.max(vh * 0.12, 100)}px ${vw * 0.09}px ${vh * 0.1}px ${vw * 0.09}px round 36px 36px 36px 36px)`;
      };
      const win = document.querySelector<HTMLElement>('.window')!;
      const nameEl = document.querySelector<HTMLElement>('.film-name')!;
      const nl = document.querySelector<HTMLElement>('.name-l')!;
      const nr = document.querySelector<HTMLElement>('.name-r')!;
      const IDLE_SCALE = mobile ? 1.16 : 1.12;
      const idleY = () => -stage.clientHeight * (mobile ? 0.075 : 0.055);
      const span = mobile ? 19 : 38;
      let lastE = -1;
      frame = (c: number) => {
        const k = Math.min(1, Math.max(0, c / span));
        const e = Math.round(k * k * (3 - 2 * k) * 1000) / 1000;
        if (e === lastE) return;
        lastE = e;
        gsap.set(canvas, { scale: IDLE_SCALE + (1 - IDLE_SCALE) * e, y: idleY() * (1 - e), transformOrigin: '50% 50%', force3D: true });
      };
      let lastW = 0;
      const layout = (force = false) => {
        const vw = window.innerWidth, vh = stage.clientHeight;
        if (!force && vw === lastW) return;
        lastW = vw;
        const gut = vw > 1920 ? vw * 0.026 : Math.min(44, Math.max(18, vw * 0.03));
        nameEl.style.fontSize = '100px';
        const w = Math.max(nl.scrollWidth, nr.scrollWidth);
        const gap = mobile ? 0 : Math.max(56, vw * 0.05);
        const room = mobile ? vw - gut * 2 : vw / 2 - gut - gap;
        const size = Math.min((room / w) * 100, mobile ? vh * 0.11 : vh * 0.27);
        nameEl.style.fontSize = size + 'px';
        const lineH = size * 0.86;
        const footRoom = mobile ? 200 : Math.max(120, vh * 0.15);
        // beside her on wide screens (her body centres at about 46% of the height), stacked above the foot on phones
        const top = mobile ? vh - footRoom - lineH * 2 : vh * 0.465 - lineH * 0.5;
        stage.style.setProperty('--name-top', top + 'px');
        stage.style.setProperty('--name-gap', gap + 'px');
        lastE = -1; // re-apply the framing at the new size
      };
      gsap.set(win, { clipPath: fullClip });
      layout(true);
      document.fonts?.load('100px Playball').finally(() => layout(true));
      document.fonts?.ready.then(() => layout(true));
      window.addEventListener('resize', () => layout());
      // mist clears off the scene as the page arrives; it runs on the frame around the film,
      // so it never fights the scroll animation on the film itself
      if (!reduced) gsap.fromTo(win, { filter: 'blur(18px)', scale: 1.1 }, { filter: 'blur(0px)', scale: 1, duration: 2, ease: 'expo.out', clearProps: 'filter,transform' });
      const phaseEls = gsap.utils.toArray<HTMLElement>('.phase');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#film', start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 1.6, invalidateOnRefresh: true,
          onUpdate: (st) => {
            const p = Math.min(1, Math.max(0, (st.progress - 0.03) / 0.86));
            idle = st.progress < 0.002;
            target = p * (N - 1);
            const ph = st.progress < 0.42 ? 0 : st.progress < 0.66 ? 1 : 2;
            phaseEls.forEach((el, i) => el.classList.toggle('on', i === ph));
          },
        },
      });
      tl.to('.name-l', { xPercent: -130, opacity: 0, duration: 11, ease: 'power2.in' }, 0)
        .to('.name-r', { xPercent: 130, opacity: 0, duration: 11, ease: 'power2.in' }, 0)
        .to('.film-lead, .film-foot', { y: -30, opacity: 0, duration: 6 }, 0)
        .to('.hero-shade', { opacity: 0, duration: 10 }, 0)
        .fromTo('.veil', { opacity: 0 }, { opacity: 1, duration: 6 }, 14)
        .fromTo('.top-veil', { opacity: 1 }, { opacity: 1, duration: 1 }, 0)
        .fromTo('.phases', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 5 }, 15);
      const chapters = gsap.utils.toArray<HTMLElement>('.chapter');
      const at = [19, 44, 68];
      chapters.forEach((ch, i) => {
        const words = ch.querySelectorAll('.cw > span');
        const para = ch.querySelector('p');
        if (reduced) {
          tl.fromTo(ch, { opacity: 0 }, { opacity: 1, duration: 3 }, at[i]).to(ch, { opacity: 0, duration: 3 }, at[i] + 15);
          return;
        }
        tl.set(ch, { opacity: 1 }, at[i])
          .fromTo(words, { yPercent: 175 }, { yPercent: 0, duration: 5, stagger: 0.7, ease: 'power3.out' }, at[i])
          .fromTo(para, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, at[i] + 3)
          .to(words, { yPercent: -175, duration: 4, stagger: 0.4, ease: 'power2.in' }, at[i] + 15)
          .to(para, { opacity: 0, y: -14, duration: 3 }, at[i] + 15)
          .set(ch, { opacity: 0 }, at[i] + 20);
      });
      tl.to('.veil', { opacity: 0, duration: 4 }, 86)
        .to('.phases', { opacity: 0, duration: 3 }, 86)
        .to('.top-veil', { opacity: 0, duration: 4 }, 88)
        .to('.window', { clipPath: () => endClip(), duration: 12, ease: 'power2.inOut' }, 88)
        .set({}, {}, 100);

      // ---------- 2. statement: words light up as you read ----------
      // the section holds still until every word is lit, then a short rest, then the page moves on
      if (!reduced) {
        const stl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.statement-sec', start: 'top top', end: () => '+=' + window.innerHeight * 2.2,
            scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          },
        });
        // the circle opens out to the whole screen, the light dims a little, and the words come up in white over it
        const orb = document.querySelector<HTMLElement>('.st-orb')!;
        const sec = orb.parentElement!;
        const d = () => Math.min(window.innerHeight * (mobile ? 0.4 : 0.5), window.innerWidth * 0.8);
        const top = () => 74 + window.innerHeight * 0.025;
        const mid = () => top() + d() / 2;
        const full = () => Math.max(sec.clientWidth, sec.clientHeight / 1.5);
        stl.fromTo(orb,
          { clipPath: () => `circle(${d() / 2}px at ${sec.clientWidth / 2}px ${mid()}px)` },
          { clipPath: () => `circle(${Math.hypot(sec.clientWidth, sec.clientHeight)}px at ${sec.clientWidth / 2}px ${sec.clientHeight / 2}px)`, duration: 2, ease: 'power2.in' }, 0)
          .fromTo('.st-orb img',
            { width: d, left: () => (sec.clientWidth - d()) / 2, top: () => mid() - d() * 1.5 * 0.57 },
            { width: full, left: () => (sec.clientWidth - full()) / 2, top: () => -(full() * 1.5 - sec.clientHeight) * 0.42, duration: 2, ease: 'power2.inOut' }, 0)
          .fromTo('.st-shade', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.8)
          // the words travel to the foot of the picture so her face stays clear
          .fromTo('.statement', { y: 0 }, { y: () => { const el = document.querySelector<HTMLElement>('.statement')!; const sec = el.parentElement!; return Math.max(0, sec.clientHeight - el.offsetTop - el.offsetHeight - sec.clientHeight * 0.07); }, duration: 1.6, ease: 'power2.inOut' }, 0.2)
          .fromTo('.statement', { color: '#241a14' }, { color: '#ffffff', duration: 1 }, 0.9)
          .fromTo('.statement .w', { opacity: 0.18 }, { opacity: 1, duration: 0.5, stagger: 0.2 }, 1.8)
          .to({}, { duration: 1.2 });
      }

      // ---------- 3. about: blinds lift off the portrait, numbers count up ----------
      gsap.fromTo('.blind', { scaleY: 1 }, {
        scaleY: 0, ease: 'power3.inOut', stagger: 0.08, duration: 1.4,
        scrollTrigger: { trigger: '.about-photo', start: 'top 75%', once: true },
      });
      gsap.fromTo('.about-photo img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.about-photo', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.utils.toArray<HTMLElement>('.count').forEach((el) => {
        const end = Number(el.dataset.to);
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true }, onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
      });
      gsap.from('.about-text .ln', { yPercent: 100, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.about-text', start: 'top 78%', once: true } });

      // ---------- 4. offers: cards stack like folded blankets ----------
      const cards = gsap.utils.toArray<HTMLElement>('.offer');
      cards.forEach((card, i) => {
        if (mobile || i === cards.length - 1) return;
        // the card underneath keeps its size and edges; it quietly fills with its own colour,
        // so the stack reads as neat layered tabs, not shrinking slivers of photographs
        gsap.to(card.querySelector('.offer-shade'), {
          opacity: 1, ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top 70%', end: 'top 20%', scrub: true },
        });
      });
      cards.forEach((card) => {
        gsap.fromTo(card.querySelector('.offer-img img'), { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 15%', scrub: true } });
      });

      // ---------- 5. retreat: mornings drift past, the one in the middle comes forward ----------
      const track = document.querySelector<HTMLElement>('.mornings-track');
      const mcards = gsap.utils.toArray<HTMLElement>('.m-card');
      const bar = document.querySelector<HTMLElement>('.m-progress span');
      if (track) {
        const dist = () => track.scrollWidth - window.innerWidth;
        const focus = () => {
          const mid = window.innerWidth / 2;
          mcards.forEach((c) => {
            const r = c.getBoundingClientRect();
            const d = Math.min(1, Math.abs(r.left + r.width / 2 - mid) / (window.innerWidth * 0.6));
            gsap.set(c, { scale: 1 - d * 0.14 });
            const im = c.querySelector('img');
            if (im) gsap.set(im, { xPercent: ((r.left + r.width / 2 - mid) / window.innerWidth) * -12 });
          });
        };
        gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: '#retreat', start: 'top top', end: () => `+=${dist() * 1.5}`, scrub: 1.4, pin: true, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (st) => { if (bar) bar.style.transform = `scaleX(${st.progress})`; },
          },
          onUpdate: focus,
        });
        focus();
      }

      // ---------- 6. schedule: rows arrive one after another ----------
      gsap.from('.sch-row', { x: 70, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '.sch-list', start: 'top 80%', once: true } });
      gsap.fromTo('.sch-photo img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.sch-photo', start: 'top bottom', end: 'bottom top', scrub: true } });

      // ---------- 7. questions: the list slides up, the picture follows the open question ----------
      gsap.from('.q-item', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.q-list', start: 'top 82%', once: true } });
      gsap.fromTo('.q-photos', { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.q-photos', start: 'top 80%', once: true } });

      // ---------- 8. close: letters rise, the garden opens ----------
      gsap.from('.close-h .ch', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: '.close-h', start: 'top 85%', once: true } });
      gsap.from('.close-text .fade', { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.4, scrollTrigger: { trigger: '.close-h', start: 'top 85%', once: true } });
      gsap.fromTo('.close-window', { clipPath: mobile ? 'inset(8% 18% 8% 18% round 999px)' : 'inset(6% 32% 6% 32% round 999px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: '.close-window', start: 'top 85%', end: 'top 10%', scrub: true },
      });

      // ---------- 9. footer: the name rises out of the ground ----------
      gsap.from('.foot-name .fl', { yPercent: 105, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 92%', once: true } });

      // ---------- entrances for every section ----------
      if (!reduced) {
        const once = (trigger: string | Element, start = 'top 78%') => ({ trigger, start, once: true });

        // statement: the circle settles in

        // about: the four figures rise one by one
        gsap.from('.stats > div', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: once('.stats', 'top 88%') });

        // offers: the intro line, then each card tilts up into the stack
        gsap.from('.offers-head p', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.2, scrollTrigger: once('.offers-head', 'top 82%') });
        gsap.utils.toArray<HTMLElement>('.offer').forEach((card) => {
          const inner = card.querySelector('.offer-in');
          gsap.fromTo(inner, { y: 90, rotateX: -5, opacity: 0, transformPerspective: 1600 }, {
            y: 0, rotateX: 0, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 55%', scrub: 0.8 },
          });
          gsap.fromTo(card.querySelector('.offer-img'), { clipPath: 'inset(100% 0% 0% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 45%', scrub: 0.8 },
          });
          gsap.from(card.querySelectorAll('.offer-text > *'), { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: once(card, 'top 62%') });
        });

        // retreat: words up, details in, the arches rise from the water
        gsap.from('.m-intro .lead, .m-intro p:not(.lead), .m-intro .btn', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay: 0.25, scrollTrigger: once('#retreat', 'top 70%') });
        gsap.from('.m-card', { y: 120, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.09, delay: 0.2, scrollTrigger: once('#retreat', 'top 70%') });
        gsap.from('.m-progress', { scaleX: 0, transformOrigin: '0 50%', duration: 1.4, ease: 'expo.out', delay: 0.5, scrollTrigger: once('#retreat', 'top 70%') });

        // schedule: the note fades in, the photograph wipes open from the left
        gsap.from('.sch-text > p', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.15, scrollTrigger: once('.schedule', 'top 75%') });
        gsap.fromTo('.sch-photo', { clipPath: 'inset(0% 100% 0% 0% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.6, ease: 'expo.inOut', delay: 0.2, scrollTrigger: once('.schedule', 'top 75%') });

        // footer: the details rise before the name
        gsap.from('.foot-top', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: once('.foot', 'top 96%') });
        gsap.from('.foot-meta', { y: 20, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.3, scrollTrigger: once('.foot', 'top 92%') });
      }

      // dividers draw outward from their centre as they arrive
      gsap.utils.toArray<HTMLElement>('.divider').forEach((d) => {
        if (reduced) return;
        const st = { trigger: d, start: 'top 88%', once: true };
        gsap.from(d.querySelectorAll('.dl'), { scaleX: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: st });
        gsap.from(d.querySelector('.dd'), { scale: 0, opacity: 0, duration: 1, ease: 'back.out(2)', delay: 0.15, scrollTrigger: st });
      });

      // section headings: each word slides up through its own mask
      gsap.utils.toArray<HTMLElement>('.split').forEach((h) => {
        gsap.from(h.querySelectorAll('.cw > span'), { yPercent: 160, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
      });

      if (!reduced) {
        gsap.from('.film-name .nl', { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.035, delay: 0.35 });
        gsap.from('.film-lead, .film-foot', { y: 22, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.7 });
        if (!mobile && window.matchMedia('(hover: hover)').matches) {
          const cx = gsap.quickTo('.film-canvas', 'x', { duration: 1.8, ease: 'power3.out' });
          const lx = gsap.quickTo('.film-name', 'x', { duration: 1.6, ease: 'power3.out' });
          window.addEventListener('pointermove', (e) => {
            const k = idle ? 1 : 0;
            const mx = (e.clientX / window.innerWidth - 0.5) * 2 * k;
            cx(mx * -22); lx(mx * 12);
          });
          ScrollTrigger.create({ trigger: '#film', start: 'top+=2 top', onEnter: () => { cx(0); lx(0); } });
        }
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
      cleanup = () => { ScrollTrigger.getAll().forEach((t) => t.kill()); lenis?.destroy(); };
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
      window.removeEventListener('resize', size);
      if (navCheck) window.removeEventListener('scroll', navCheck);
      cleanup?.();
    };
  }, []);

  const words = (t: string) => t.split(' ').flatMap((w, i) => [i ? ' ' : null, <span className="cw" key={i}><span>{w}</span></span>]);

  return (
    <>
      <Header />

      <main id="top">
        {/* 1. THE FILM */}
        <section id="film" className="film" aria-labelledby="film-h">
          <div className="film-stage">
            <div className="window">
              <canvas ref={canvasRef} className="film-canvas" aria-hidden="true" />
              <div className="veil" aria-hidden="true" />
            </div>
            <div className="hero-shade" aria-hidden="true" />
            <div className="top-veil" aria-hidden="true" />
            <h1 id="film-h" className="film-name">
              <span className="name-l"><span className="nm"><span className="nl">Ahana</span></span> </span>
              <span className="name-r"><span className="nm"><span className="nl">Mehra</span></span></span>
            </h1>
            <p className="film-lead">Yoga teacher for calm, strong mornings. Private, online and on retreat.</p>
            <div className="film-foot">
              <a className="btn" href={BOOK}>Book a first class</a>
            </div>
            <ol className="phases" aria-hidden="true">
              {PHASES.map((p) => <li className="phase" key={p}>{p}</li>)}
            </ol>
            <div className="chapters">
              {CHAPTERS.map((c) => (
                <div className="chapter" key={c.h}>
                  <h2>{words(c.h)}</h2>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. STATEMENT */}
        <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
        <section className="statement-sec" aria-labelledby="st-h">
          <div className="st-orb" aria-hidden="true"><img src={BASE + "/img/studio-namaste.webp"} alt="" /></div>
          <div className="st-shade" aria-hidden="true" />
          <h2 id="st-h" className="visually-hidden">How Ahana teaches</h2>
          <p className="statement">{STATEMENT.split(' ').map((w, i) => <span className="w" key={i}>{w} </span>)}</p>
        </section>

        {/* 3. ABOUT */}
        <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
        <section id="about" className="about" aria-labelledby="about-h">
          <figure className="about-photo">
            <img src={BASE + "/img/studio-calm.webp"} width={1600} height={1067} alt="Ahana sitting cross-legged with palms together in a bright, quiet studio" loading="lazy" />
            {[0, 1, 2, 3, 4].map((i) => <span className="blind" key={i} style={{ left: `${i * 20}%` }} aria-hidden="true" />)}
          </figure>
          <div className="about-text">
            <h2 id="about-h" className="split">{words('Meet Ahana')}</h2>
            <div className="mask"><p className="lead ln">Ahana means the first light of the sun. She has taught yoga since 2012: slow, clear classes built on the breath rather than on how a pose looks.</p></div>
            <div className="mask"><p className="ln">She trained in hatha and vinyasa in Mysore and Rishikesh, then in yin and restorative yoga. Most students come to her stiff, tired or anxious. They stay because they leave each class feeling more like themselves.</p></div>
            <dl className="stats">
              <div><dt>Years teaching</dt><dd><span className="count" data-to="14">14</span></dd></div>
              <div><dt>Students at most in a class</dt><dd><span className="count" data-to="8">8</span></dd></div>
              <div><dt>Styles: hatha, vinyasa, yin</dt><dd><span className="count" data-to="3">3</span></dd></div>
              <div><dt>Languages: English and Tamil</dt><dd><span className="count" data-to="2">2</span></dd></div>
            </dl>
          </div>
        </section>

        {/* 4. OFFERS */}
        <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
        <section id="offers" className="offers" aria-labelledby="offers-h">
          <div className="offers-head">
            <h2 id="offers-h" className="split">{words('Four ways to practise')}</h2>
            <p>Start wherever suits you. Many students begin with one private session, then join the mornings. <a className="tlink" href={url('/classes/')}>See every class and price</a></p>
          </div>
          <div className="offer-stack">
            {OFFERS.map((o, i) => (
              <article className="offer" key={o.name} style={{ top: `calc(84px + ${i * 22}px)` }}>
                <div className="offer-in">
                  <span className="offer-shade" aria-hidden="true" />
                  <div className="offer-img"><img src={o.img} alt={o.alt} loading="lazy" /></div>
                  <div className="offer-text">
                    <h3>{o.name}</h3>
                    <p className="offer-line">{o.line}</p>
                    <p>{o.desc}</p>
                    <dl className="offer-meta">
                      {o.meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                    </dl>
                    <a className="btn" href={bookFor(o.id)}>Book {o.name.toLowerCase()}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5. RETREAT */}
        <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
        <section id="retreat" className="retreat" aria-labelledby="retreat-h">
          <div className="mornings-track">
            <div className="m-intro">
              <h2 id="retreat-h" className="split">{words('Seven mornings by the water')}</h2>
              <p className="lead">A retreat for twelve guests, 8 to 15 February 2027, at a lagoon in the Western Ghats.</p>
              <p>Shared rooms from ₹78,000, single rooms ₹96,000. All meals, classes and airport transfers included.</p>
              <a className="btn" href={bookFor('retreat')}>Reserve a place</a>
              <p><a className="tlink" href={url('/retreat/')}>See the whole retreat</a></p>
            </div>
            {MORNINGS.map((m) => (
              <figure className="m-card" key={m.word}>
                <div className="m-img"><img src={m.img} alt={m.alt} loading="lazy" /></div>
                <figcaption>
                  <span className="m-word">{m.word}</span>
                  <span className="m-line">{m.line}</span>
                  <span className="m-day">{m.day}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="m-progress" aria-hidden="true"><span /></div>
        </section>

        {/* 6. SCHEDULE */}
        <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
        <section id="schedule" className="schedule" aria-labelledby="sch-h">
          <div className="sch-text">
            <h2 id="sch-h" className="split">{words('This week')}</h2>
            <p>All times are Indian Standard Time. Online classes are live, and the link arrives an hour before. <a className="tlink" href={url('/classes/#week')}>Full timetable</a></p>
            <figure className="sch-photo"><img src={BASE + "/img/mudra.webp"} width={1600} height={2400} alt="A hand resting in a mudra on a knee, in soft white light" loading="lazy" /></figure>
          </div>
          <ul className="sch-list">
            {SCHEDULE.map(([wd, d, t, c, w]) => (
              <li key={d} className={`sch-row${wd === today ? ' today' : ''}`}>
                <span className="sch-day">{d}{wd === today && <em> · today</em>}</span>
                <span className="sch-time">{t}</span>
                <span className="sch-class">{c}</span>
                <span className="sch-where">{w}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 7. QUESTIONS */}
        <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
        <section id="questions" className="questions" aria-labelledby="q-h">
          <div className="q-photos">
            {FAQ.map((f, i) => <img key={f.q} src={f.img} alt={i === open ? f.alt : ''} className={i === open ? 'on' : ''} loading="lazy" />)}
          </div>
          <div className="q-col">
            <h2 id="q-h" className="split">{words('Questions')}</h2>
            <ul className="q-list">
              {FAQ.map((f, i) => (
                <li className={`q-item${i === open ? ' open' : ''}`} key={f.q}>
                  <button aria-expanded={i === open} aria-controls={`qa-${i}`} onClick={() => setOpen(i === open ? -1 : i)}>
                    <span>{f.q}</span><span className="plus" aria-hidden="true" />
                  </button>
                  <div className="q-a" id={`qa-${i}`} role="region"><div><p>{f.a}</p></div></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. CLOSE */}
        <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
        <section className="close" aria-labelledby="close-h">
          <div className="close-text">
            <h2 id="close-h" className="close-h" aria-label="Begin with one breath">
              {['Begin', 'with', 'one', 'breath'].flatMap((w, i) => [i ? ' ' : null, <span className="cm" key={w} aria-hidden="true"><span className="ch">{w}</span></span>])}
            </h2>
            <p className="fade">Write to Ahana with what you are looking for. She replies within a day.</p>
            <a className="btn fade" href={BOOK}>Book a first class</a>
          </div>
          <div className="close-window">
            <img src={BASE + "/img/pavilion.webp"} width={1600} height={2404} alt="Mats and pale blue bolsters laid out in an open bamboo pavilion among the trees" loading="lazy" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
