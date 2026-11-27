'use client';

import { useEffect } from 'react';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

type Scene = (gsap: typeof Gsap, ScrollTrigger: typeof ST, env: { mobile: boolean }) => void;

/** Smooth scroll, the shared entrances and one optional scene per inner page.
 *  Tweens end at the stylesheet's own state, so the page reads in full
 *  without script and with reduced motion. */
export function useMotion(scene?: Scene) {
  useEffect(() => {
    let alive = true;
    let cleanup: (() => void) | undefined;
    const nav = () => document.querySelector('.nav')?.classList.toggle('solid', window.scrollY > 24);
    window.addEventListener('scroll', nav, { passive: true });
    nav();

    (async () => {
      const [{ gsap }, { ScrollTrigger }, lenisMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
      if (!alive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      const mobile = window.innerWidth < 768;
      let lenis: InstanceType<typeof lenisMod.default> | null = null;
      const tick = (t: number) => lenis?.raf(t * 1000);
      if (!navigator.webdriver) {
        lenis = new lenisMod.default({ duration: 1.4, smoothWheel: true, wheelMultiplier: 0.85 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }
      const anchor = (e: Event) => {
        const a = (e.target as Element).closest?.('a[href^="#"]');
        if (!a || !lenis) return;
        const id = a.getAttribute('href')!;
        const el = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { duration: 1.6 });
      };
      document.addEventListener('click', anchor);

      const ctx = gsap.context(() => {
        const once = (trigger: Element, start = 'top 85%') => ({ trigger, start, once: true });
        gsap.utils.toArray<HTMLElement>('.split').forEach((h) => {
          gsap.from(h.querySelectorAll('.cw > span'), { yPercent: 160, duration: 1.2, ease: 'expo.out', stagger: 0.07, scrollTrigger: once(h, 'top 90%') });
        });
        gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
          gsap.from(el.children, { y: 44, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, clearProps: 'transform,opacity', scrollTrigger: once(el, 'top 88%') });
        });
        gsap.utils.toArray<HTMLElement>('[data-wipe]').forEach((el) => {
          gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: once(el, 'top 86%') });
        });
        gsap.utils.toArray<HTMLElement>('[data-drift] img').forEach((img) => {
          gsap.fromTo(img, { yPercent: -6, scale: 1.16 }, { yPercent: 6, scale: 1.16, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>('.divider').forEach((d) => {
          gsap.from(d.querySelectorAll('.dl'), { scaleX: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: once(d, 'top 90%') });
          gsap.from(d.querySelector('.dd'), { scale: 0, duration: 1, ease: 'back.out(2)', delay: 0.15, scrollTrigger: once(d, 'top 90%') });
        });
        gsap.from('.foot-name .fl', { yPercent: 105, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 92%', once: true } });
        scene?.(gsap, ScrollTrigger, { mobile });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
      cleanup = () => {
        document.removeEventListener('click', anchor);
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis?.destroy();
      };
    })();

    return () => { alive = false; window.removeEventListener('scroll', nav); cleanup?.(); };
    // the scene is set up once per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
