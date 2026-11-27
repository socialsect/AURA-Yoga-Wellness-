import type { Metadata } from 'next';
import View from './view';

export const metadata: Metadata = {
  title: 'Questions · Ahana Mehra',
  description: 'Answers about starting yoga, classes, online practice, the retreat and booking.',
};

export default function Page() {
  return <View />;
}
