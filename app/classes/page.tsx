import type { Metadata } from 'next';
import View from './view';

export const metadata: Metadata = {
  title: 'Classes and prices · Ahana Mehra',
  description: 'Private sessions, small group mornings, live online classes and a beginners course, with times and prices.',
};

export default function Page() {
  return <View />;
}
