import type { Metadata } from 'next';
import View from './view';

export const metadata: Metadata = {
  title: 'About · Ahana Mehra',
  description: 'How Ahana Mehra teaches: slow, clear yoga built on the breath, since 2012.',
};

export default function Page() {
  return <View />;
}
