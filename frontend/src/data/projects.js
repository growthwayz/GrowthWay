export const categories = [
  'All',
  'Branding',
  'Content',
  'Social',
  'Campaigns',
  'Events',
];

export const projects = [
  {
    id: '01',
    slug: 'aura-beauty',
    title: 'AURA',
    categories: ['Branding', 'Content', 'Campaigns'],
    description: 'A premium beauty brand campaign crafted to blend elegance, emotions and modern lifestyle aesthetics.',
    longDescription: 'We reimagined Aura\'s entire visual identity — from bespoke packaging to a multi-platform campaign that reached 2.4M impressions in its first week. Every touchpoint was designed to evoke the quiet confidence of modern femininity.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop',
    featured: true,
    stats: { reach: '2.4M', engagement: '340%', duration: '8 Weeks' },
    metadata: {
      client: 'Aura Beauty',
      role: 'Creative Direction · Brand Strategy',
      year: '2025',
      location: 'New York / Milan'
    }
  },
  {
    id: '02',
    slug: 'lumina-events',
    title: 'Lumina',
    categories: ['Events', 'Social'],
    description: 'Immersive brand activation and social content strategy for an international design festival.',
    longDescription: 'Lumina required a living, breathing digital presence that mirrored the energy of their 3-day festival. We deployed a 12-person content team capturing 400+ assets in real-time, driving social engagement up 280% year-over-year.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop',
    featured: false,
    composition: 'split',
    stats: { reach: '1.8M', engagement: '280%', duration: '3 Days' },
    metadata: {
      client: 'Lumina Festival',
      role: 'Event Coverage · Social Strategy',
      year: '2024',
      location: 'Berlin'
    }
  },
  {
    id: '03',
    slug: 'noir-athletics',
    title: 'Noir Athletics',
    categories: ['Branding', 'Campaigns'],
    description: 'Gritty, high-performance visual identity and launch campaign for a boutique fitness apparel line.',
    longDescription: 'Noir Athletics needed to disrupt a crowded fitness market. We built a brand system rooted in raw intensity — monochrome palettes, kinetic typography, and campaign photography that captured the beauty of human movement under pressure.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop',
    featured: false,
    composition: 'portrait',
    stats: { reach: '960K', engagement: '195%', duration: '12 Weeks' },
    metadata: {
      client: 'Noir',
      role: 'Brand Identity · Art Direction',
      year: '2024',
      location: 'Los Angeles'
    }
  },
  {
    id: '04',
    slug: 'elevate-tech',
    title: 'Elevate',
    categories: ['Content', 'Social'],
    description: 'Ongoing social media management and reels production for a fast-growing B2B tech startup.',
    longDescription: 'Elevate was scaling fast but their brand voice was fragmented across channels. We unified their content strategy, producing 60+ pieces monthly — from thought leadership carousels to behind-the-scenes reels — growing their LinkedIn following by 340% in six months.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop',
    featured: false,
    composition: 'dark',
    stats: { reach: '3.1M', engagement: '340%', duration: '6 Months' },
    testimonial: {
      quote: 'Growthway didn\'t just manage our social — they gave us a voice that people actually listen to.',
      author: 'Priya Mehta',
      title: 'CMO, Elevate'
    },
    metadata: {
      client: 'Elevate',
      role: 'Content Strategy · Production',
      year: '2025',
      location: 'San Francisco'
    }
  },
  {
    id: '05',
    slug: 'zenith-coffee',
    title: 'Zenith Roasters',
    categories: ['Branding', 'Content'],
    description: 'Art direction and packaging design for a specialty coffee roaster expanding into international markets.',
    longDescription: 'From bean sourcing stories to shelf-ready packaging, we crafted Zenith\'s entire brand world — minimal, tactile, and deeply rooted in the craft of specialty coffee. The rebrand led to placement in 120+ premium retailers across Europe and Asia.',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop',
    featured: false,
    composition: 'typography',
    stats: { reach: '520K', engagement: '210%', duration: '16 Weeks' },
    metadata: {
      client: 'Zenith',
      role: 'Packaging · Brand World',
      year: '2024',
      location: 'Tokyo / London'
    }
  }
];

export const clientLogos = [
  'Aura Beauty', 'Lumina Festival', 'Noir Athletics', 'Elevate', 'Zenith Roasters'
];

export const stats = [
  { number: '40+', label: 'Projects Delivered' },
  { number: '12', label: 'Countries Reached' },
  { number: '2.8B', label: 'Total Impressions' },
  { number: '97%', label: 'Client Retention' },
];
