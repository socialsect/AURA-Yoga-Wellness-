// Sample content for the concept site. Replace with the client's real details before launch.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const EMAIL = 'hello@ahanamehra.com';
export const mail = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
export const url = (path: string) => BASE + path;
export const BOOK = url('/contact/');
export const bookFor = (id: string) => url(`/contact/?class=${id}`);

export const OFFERS = [
  { id: 'private', name: 'Private sessions', line: 'One to one, built around you', desc: 'We start with how your body feels today and what you want to change: sleep, back pain, stress, strength. Every session is planned for you alone.', meta: [['Length', '75 minutes'], ['Where', 'Studio or your home'], ['Price', '₹3,500']], img: BASE + '/img/assist.webp', alt: 'A teacher gently guiding a student into triangle pose' },
  { id: 'group', name: 'Small group mornings', line: 'Eight mats, slow and steady', desc: 'A calm hatha flow, breathwork and a long rest at the end. Small enough that Ahana knows your name and your knees.', meta: [['Length', '60 minutes'], ['When', 'Mon, Wed, Fri, 6:30 am'], ['Price', '₹900']], img: BASE + '/img/beach-group.webp', alt: 'A small group holding tree pose together on a misty beach' },
  { id: 'online', name: 'Live online', line: 'The same class, wherever you are', desc: 'Join from your living room. Classes are live, not recorded, so Ahana can see you and cue you if your camera is on.', meta: [['Length', '60 minutes'], ['When', 'Tue and Thu, 7 pm IST'], ['Price', '₹600']], img: BASE + '/img/window-tree.webp', alt: 'A woman in tree pose beside a tall bright window at home' },
  { id: 'retreat', name: 'Retreats', line: 'Seven mornings away from it all', desc: 'Two classes a day, long silences, swims, simple vegetarian food and early nights, with twelve guests.', meta: [['Length', '7 nights'], ['Next', '8 to 15 February 2027'], ['Price', 'from ₹78,000']], img: BASE + '/img/villa-pool.webp', alt: 'A quiet villa with a long pool among palm trees' },
];

export const MORNINGS = [
  { day: 'Mon 8 Feb', word: 'Arrive', line: 'Settle into your room and the garden. A gentle evening stretch.', img: BASE + '/img/villa-garden.webp', alt: 'A garden villa with a green pool and palms' },
  { day: 'Tue 9 Feb', word: 'Breathe', line: 'Long, slow breathing practice before the sun is up.', img: BASE + '/img/curtains.webp', alt: 'A woman meditating between white curtains' },
  { day: 'Wed 10 Feb', word: 'Root', line: 'Standing poses and steady feet on the mat.', img: BASE + '/img/mat.webp', alt: 'Bare feet and hands on a green yoga mat in soft light' },
  { day: 'Thu 11 Feb', word: 'Open', line: 'Morning practice on the pavilion over the water.', img: BASE + '/img/water-deck.webp', alt: 'A group practising in an open pavilion above a river' },
  { day: 'Fri 12 Feb', word: 'Balance', line: 'Strength and stillness, then a free afternoon.', img: BASE + '/img/garden-path.webp', alt: 'A woman stretching on a flowering garden path' },
  { day: 'Sat 13 Feb', word: 'Rest', line: 'Yin, a swim and a long, slow afternoon.', img: BASE + '/img/pool-light.webp', alt: 'Sunlight and leaf shadows on clear pool water' },
  { day: 'Sun 14 Feb', word: 'Nourish', line: 'A last sunrise class and breakfast together.', img: BASE + '/img/breakfast.webp', alt: 'Two bowls of porridge with fresh fruit' },
];

export const SCHEDULE: [number, string, string, string, string][] = [
  [1, 'Monday', '6:30 am', 'Morning hatha flow', 'Studio and online'],
  [2, 'Tuesday', '7:00 pm', 'Yin and restore', 'Online'],
  [3, 'Wednesday', '6:30 am', 'Morning hatha flow', 'Studio and online'],
  [4, 'Thursday', '7:00 pm', 'Slow vinyasa', 'Online'],
  [5, 'Friday', '6:30 am', 'Morning hatha flow', 'Studio and online'],
  [6, 'Saturday', '8:00 am', 'Beginners’ course, four weeks', 'Studio'],
];

export const FAQ = [
  { q: 'I have never done yoga. Where do I start?', a: 'With a private session or the Saturday beginners’ course. You learn the basic poses and how to breathe through them, then join the morning classes when you feel ready.', img: BASE + '/img/pavilion.webp', alt: 'Mats and pale blue bolsters laid out in a bamboo pavilion' },
  { q: 'Do I need to be flexible?', a: 'No. Flexibility is something yoga gives you, not something you need first. Every pose has a version that works for your body today.', img: BASE + '/img/studio-namaste.webp', alt: 'A smiling woman sitting cross-legged with palms together in a bright room' },
  { q: 'What do I bring?', a: 'Comfortable clothes and water. Mats, blocks and blankets are at the studio; online, a towel and a cushion will do.', img: BASE + '/img/mat.webp', alt: 'A green yoga mat in soft daylight' },
  { q: 'How do online classes work?', a: 'You receive a link an hour before. The class is live, not recorded, so Ahana can see you and offer cues if your camera is on.', img: BASE + '/img/window-tree.webp', alt: 'Practising at home beside a bright window' },
  { q: 'Can I come if I am pregnant or injured?', a: 'Please write before your first class. Some poses change, some are skipped, and a private session first is often the kindest start.', img: BASE + '/img/curtains.webp', alt: 'A woman meditating quietly between white curtains' },
];

