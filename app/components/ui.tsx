export const words = (t: string) =>
  t.split(' ').flatMap((w, i) => [i ? ' ' : null, <span className="cw" key={i}><span>{w}</span></span>]);

export const Divider = () => (
  <div className="divider" aria-hidden="true"><span className="dl" /><span className="dd" /><span className="dl" /></div>
);
