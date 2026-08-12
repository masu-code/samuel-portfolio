import type { AboutContent } from '../types/content'

export const about: AboutContent = {
  introSegments: [
    { text: "I'm currently a " },
    { text: 'Software Engineer', className: 'font-bold text-slate-lightest' },
    { text: ' at ' },
    { text: 'Homecam', className: 'font-bold text-mint' },
    {
      text:
        ", a company specializing in security electronics and solar panel systems, where I lead development of their core mobile and web tools. I built their client and contract management platform from scratch (a native iOS app paired with a companion web app), plus their Shopify storefront and a native canvassing app for the sales team.",
    },
  ],
  techList: [
    'React Native',
    'Flutter',
    'TypeScript',
    'Dart',
    'Firebase',
    'Expo',
    'Redux Toolkit',
    'PostgreSQL',
    'Shopify / Liquid',
    'React',
  ],
  closing:
    "In my free time, I'm into mechanics (cars, engines, anything I can tinker with) and I train Taekwondo, where I'm a 2nd Dan black belt.",
  photo: '/images/about.jpg',
}
