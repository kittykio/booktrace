import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Booktrace',
    short_name: 'Booktrace',
    description: 'Your personal reading history, reviews, and goals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4ead8',
    theme_color: '#482d20',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
