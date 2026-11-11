export interface Challenge {
  id: string;
  number: string;
  title: string;
  category: string;
  shortDescription: string;
  difficulty: 'Intermediate' | 'Advanced' | 'All Levels';
  skills: string[];
  image: string;
  problemStatement: string;
  requirements: string[];
  rules?: string[];
  rulesPdfUrl?: string;
  recommendedTech: string[];
  judgingCriteria: string[];
  expectedOutput: string;
  prizePool?: string;
  firstPrize?: string;
  secondPrize?: string;
  bountyNotes?: string;
  perks?: string;
}

export interface BattlePrize {
  challengeId: string;
  challengeTitle: string;
  challengeNumber?: string;
  prizeAmount: number | string;
  firstPrize?: string;
  secondPrize?: string;
  perks?: string;
}

export interface PrizesContent {
  poolTotal: string;
  battlePrizes?: BattlePrize[];
  bannerBadge?: string;
  bonusTag?: string;
  description?: string;
  perk1?: string;
  perk2?: string;
  perk3?: string;
  perk4?: string;
  trophyBoxTitle?: string;
  first?: string;
  firstSubtitle?: string;
  firstDesc?: string;
  second?: string;
  secondSubtitle?: string;
  secondDesc?: string;
  third?: string;
  thirdSubtitle?: string;
  thirdDesc?: string;
  special?: string;
  specialSubtitle?: string;
  specialDesc?: string;
  [key: string]: unknown;
}

export interface TimelineEvent {
  id: string;
  day: 'DAY 01' | 'DAY 02' | 'DAY 03';
  time: string;
  title: string;
  description: string;
  milestone?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface YourTeamMember {
  id: string;
  name: string;
  image: string;
  designationTechxera: string; // Designation in Techxera
  designationSynthara: string; // Designation in SYNTHARA2.0
  category?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
}

export interface Team {
  id: string;
  number: string;
  name: string;
  project: string;
  category: string;
  members: string[];
  summary: string;
  stack: string[];
  image: string;
}

export interface MentorJudge {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  image: string;
  linkedin: string;
  badge: 'Judge' | 'Mentor' | 'Keynote';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'EVENT' | 'TEAMS' | 'PROJECTS' | 'WORKSHOPS' | 'WINNERS';
  image: string;
  caption: string;
  year?: string;
}

export interface Partner {
  id: string;
  name: string;
  tier: 'Title Partner' | 'Platinum' | 'Gold' | 'Silver' | 'Ecosystem' | string;
  logoText?: string;
  logoUrl?: string;
  category?: string;
  perk?: string;
  websiteUrl?: string;
  description?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Title Partner' | 'Platinum' | 'Gold' | 'Silver' | 'Ecosystem' | string;
  logoText?: string;
  logoUrl?: string;
  category?: string;
  perk?: string;
  websiteUrl?: string;
  description?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  collegeOrOrg: string;
  teamName: string;
  teamMembers: string[];
  selectedChallenge: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  githubOrPortfolio: string;
  trackNotes?: string;
}

export interface RegisteredTicket {
  ticketId: string;
  registrationDate: string;
  data: RegistrationFormData;
}

export interface ContactPerson {
  id?: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  whatsapp?: string;
}

export interface ContactContent {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  whatsappNumber?: string;
  whatsappLink?: string;
  venueName?: string;
  address?: string;
  mapEmbedUrl?: string;
  googleMapsUrl?: string;
  timings?: string;
  discordUrl?: string;
  contacts?: ContactPerson[];
  [key: string]: unknown;
}
