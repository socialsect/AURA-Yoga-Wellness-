import { BOOK, EMAIL, mail, url } from '../data';
import { LINKS } from './Header';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-top">
        <div className="foot-call">
          <h2>Come breathe with me</h2>
          <a className="btn btn-ink" href={BOOK}>Book a first class</a>
        </div>
        <div className="foot-col">
          <h3>Explore</h3>
          <nav aria-label="Footer">{LINKS.map(([label, path]) => <a key={path} href={url(path)}>{label}</a>)}</nav>
        </div>
        <div className="foot-col">
          <h3>On the mat</h3>
          <p>Mon, Wed, Fri at 6:30 am</p>
          <p>Tue, Thu at 7:00 pm</p>
          <p>Saturday at 8:00 am</p>
        </div>
        <div className="foot-col">
          <h3>Write to me</h3>
          <a className="foot-mail" href={mail('Hello', 'Hello Ahana,\n\n')}>{EMAIL}</a>
          <p>A reply within a day</p>
        </div>
      </div>
      <p className="foot-name" aria-label="Ahana Mehra">
        {['Ahana', 'Mehra'].flatMap((w, i) => [i ? ' ' : null, <span className="fm" key={w} aria-hidden="true"><span className="fl">{w}</span></span>])}
      </p>
      <div className="foot-meta">
        <p>© 2027 Ahana Mehra</p>
        <p>One slow breath at a time</p>
        <a href="#top" className="to-top">Back to the top <span aria-hidden="true" /></a>
      </div>
    </footer>
  );
}
