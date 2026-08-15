import type { ProjectEntry } from '../types/content'

const ecoHome: ProjectEntry = {
  title: 'Homecam: EcoHome',
  description: 'EcoHome, a native mobile app for managing customer and job records for Homecam.',
  image: '/images/projects/ecohome.png',
  tags: ['Mobile'],
}

const canvassingApp: ProjectEntry = {
  title: 'Canvassing App for Homecam',
  description:
    'A web dashboard for Homecam\'s canvassing team, mapping leads and tracking follow-ups, fully connected to GoHighLevel through n8n automations. Customer data shown has been redacted.',
  image: '/images/projects/canvassing-app-map.png',
  tags: ['Web', 'n8n', 'GoHighLevel'],
}

const heavenlyArt: ProjectEntry = {
  title: 'Heavenly Art: Shopify Store',
  description: 'E-commerce storefront built end-to-end on Shopify.',
  image: '/images/projects/shopify-store.png',
  liveUrl: 'https://heavenlyart.co/',
  tags: ['Shopify', 'Liquid'],
}

const regaladoGroup: ProjectEntry = {
  title: 'Regalado Group',
  description: 'Real estate listings website built on Joomla for Regalado Group.',
  image: '/images/projects/regalado-group.png',
  tags: ['Joomla', 'PHP'],
  liveUrl: 'https://regaladogroup.net/',
}

const teleVault: ProjectEntry = {
  title: 'TeleVault',
  description:
    'A personal gallery and file manager that uses Telegram as its storage backend. It organizes photos, videos, and files already in Telegram into albums, with in-app preview. Built for Android and Windows.',
  image: '/images/projects/televault.png',
  tags: ['Flutter', 'Dart'],
  orientation: 'portrait',
}

const contractManagement: ProjectEntry = {
  title: 'Homecam: Client & Contract Management',
  description:
    'Client and contract management platform for a security electronics and solar panel company, built from scratch as a native iOS app with a companion web app.',
  image: '/images/projects/placeholder-1.jpg',
  tags: ['iOS', 'Web'],
}

export const featuredProjects: ProjectEntry[] = [ecoHome, canvassingApp, heavenlyArt, regaladoGroup, teleVault]

export const projects: ProjectEntry[] = [
  contractManagement,
  ecoHome,
  canvassingApp,
  heavenlyArt,
  regaladoGroup,
  teleVault,
]
