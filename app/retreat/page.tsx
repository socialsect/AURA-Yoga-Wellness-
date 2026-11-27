import type { Metadata } from 'next';
import View from './view';

export const metadata: Metadata = {
  title: 'Retreat · Ahana Mehra',
  description: 'Seven mornings by the water, 8 to 15 February 2027, for twelve guests in the Western Ghats.',
};

export default function Page() {
  return <View />;
}
