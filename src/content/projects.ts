import type { ProjectEntry } from '../types/content'

export const featuredProjects: ProjectEntry[] = [
  {
    title: 'Homecam: EcoHome',
    description:
      'EcoHome, a native mobile app for managing customer and job records for Homecam. Customer data shown has been redacted.',
    image: '/images/projects/ecohome.png',
    tags: ['Mobile'],
  },
  {
    title: 'Canvassing App for Homecam',
    description:
      'A web dashboard for Homecam\'s canvassing team, mapping leads and tracking follow-ups. Customer data shown has been redacted.',
    image: '/images/projects/canvassing-app-map.png',
    tags: ['Web'],
  },
  {
    title: 'Heavenly Art: Shopify Store',
    description: 'E-commerce storefront built end-to-end on Shopify.',
    image: '/images/projects/shopify-store.png',
    liveUrl: 'https://heavenlyart.co/',
    tags: ['Shopify', 'Liquid'],
  },
  {
    title: 'Regalado Group',
    description: 'Real estate listings website built on Joomla for Regalado Group.',
    image: '/images/projects/regalado-group.png',
    tags: ['Joomla', 'PHP'],
    liveUrl: 'https://regaladogroup.net/',
  },
]

export const projects: ProjectEntry[] = [
  {
    title: 'Homecam: Client & Contract Management',
    description:
      'Client and contract management platform for a security electronics and solar panel company, built from scratch as a native iOS app with a companion web app.',
    image: '/images/projects/placeholder-1.jpg',
    tags: ['iOS', 'Web'],
  },
  {
    title: 'TeleVault',
    description:
      'A personal file manager that uses Telegram as its storage backend. It organizes files already in Telegram into folders, with in-app preview for photos and video. Built for Android and Windows.',
    image: '/images/projects/placeholder-2.jpg',
    tags: ['Flutter', 'Dart'],
  },
]
