import type { ProjectEntry } from '../types/content'

export const featuredProjects: ProjectEntry[] = [
  {
    title: 'Homecam — Client & Contract Management',
    description:
      'Client and contract management platform for a security electronics and solar panel company, built from scratch as a native iOS app with a companion web app.',
    image: '/images/projects/placeholder-1.jpg',
    tags: ['iOS', 'Web'],
  },
  {
    title: 'TeleVault',
    description:
      'A personal file manager that uses Telegram as its storage backend — organizes files already in Telegram into folders, with in-app preview for photos and video. Built for Android and Windows.',
    image: '/images/projects/placeholder-2.jpg',
    tags: ['Flutter', 'Dart'],
  },
]

export const projects: ProjectEntry[] = [
  {
    title: 'Homecam Shopify Store',
    description: 'E-commerce storefront built end-to-end on Shopify for the same company.',
    image: '/images/projects/placeholder-3.jpg',
    tags: ['Shopify', 'Liquid'],
  },
  {
    title: 'Homecam Canvassing App',
    description: 'Native mobile canvassing app built from the ground up for the sales team.',
    image: '/images/projects/placeholder-4.jpg',
    tags: ['Mobile'],
  },
  {
    title: 'Regalado Group',
    description: 'Real estate listings website built on Joomla for Regalado Group.',
    image: '/images/projects/placeholder-5.jpg',
    tags: ['Joomla', 'PHP'],
    liveUrl: 'https://regaladogroup.net/',
  },
]
