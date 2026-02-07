import type { Metadata } from 'next';
import Home from './home';

export const metadata: Metadata = {
  title: 'Cyber Dodge - Base Game',
  description: 'An exciting dodge game on Base network',
  other: {
    'base:app_id': '6984a6d24609f1d788ad2bd3',
  },
};

export default function Page() {
  return <Home />;
}
