export interface SocialLink {
  label: string
  url: string
  icon: 'mail' | 'github' | 'linkedin'
}

export interface SiteInfo {
  name: string
  firstName: string
  role: string
  tagline: string
  email: string
  social: SocialLink[]
}

export interface AboutContent {
  intro: string
  techList: string[]
  closing: string
  photo: string
}

export interface ExperienceEntry {
  company: string
  role: string
  dateRange: string
  url?: string
  bullets: string[]
}

export interface ProjectEntry {
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
}
