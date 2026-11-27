import type { Metadata } from 'next';
import View from './view';

export const metadata: Metadata = {
  title: 'Book a class · Ahana Mehra',
  description: 'Write to Ahana to book a first class, a private session or a place on the retreat.',
};

export default function Page() {
  return <View />;
}
