import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ContactContent, YourTeamMember } from '../types';

export interface SiteContent {
  eventInfo: {
    name: string;
    shortName: string;
    titleGothic?: string;
    titleAccent?: string;
    tagline: string;
    dates: string;
    venue: string;
    location: string;
    prizePool: string;
    hours: number;
    participants: number;
    edition: string;
    countdownTargetDate?: string;
    [key: string]: unknown;
  };
  eventControl?: {
    countdownTargetDate?: string;
    battlegroundsLocked?: boolean;
    battlegroundsLockedMessage?: string;
    sponsorsLocked?: boolean;
    sponsorsLockedMessage?: string;
    yourTeamLocked?: boolean;
    yourTeamLockedMessage?: string;
    [key: string]: unknown;
  };
  battlegrounds?: {
    title?: string;
    subtitle?: string;
    description?: string;
    tracksCount?: string;
    prizePool?: string;
    duration?: string;
    teamSize?: string;
    bottomCtaText?: string;
    bottomCtaButton?: string;
    [key: string]: unknown;
  };
  hero: {
    titleGothic?: string;
    titleAccent?: string;
    subheadline: string;
    description: string;
    seatsClaimed: number;
    seatsTotal: number;
    capText?: string;
    countdownTargetDate?: string;
    showCountdown?: boolean;
    joinBattleLabel?: string;
    battlegroundsLabel?: string;
    timelineLabel?: string;
    [key: string]: unknown;
  };
  navbar: {
    brandName: string;
    brandAccent?: string;
    brandSubline: string;
    siteLogoUrl?: string;
    [key: string]: unknown;
  };
  mission: {
    badge: string;
    title: string;
    description: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    communityBadge?: string;
    communityTitle?: string;
    communityDesc?: string;
    communityBtnLabel?: string;
    communityUrl?: string;
    communityScheduleBtnLabel?: string;
    communityScheduleUrl?: string;
    communityInstagramUrl?: string;
    [key: string]: unknown;
  };
  stats: {
    hours: string;
    hoursLabel: string;
    hoursSub: string;
    prizePool: string;
    prizePoolLabel: string;
    prizePoolSub: string;
    hackers: string;
    hackersLabel: string;
    hackersSub: string;
    tracks: string;
    tracksLabel: string;
    tracksSub: string;
    [key: string]: unknown;
  };
  prizes: {
    poolTotal: string;
    battlePrizes?: Array<{
      challengeId: string;
      challengeTitle?: string;
      challengeNumber?: string;
      prizeAmount: number | string;
      firstPrize?: string;
      secondPrize?: string;
      perks?: string;
    }>;
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
  };
  teams: Array<{
    id: string;
    number: string;
    name: string;
    category: string;
  }>;
  yourTeam: YourTeamMember[];
  yourTeamCategories?: string[];
  yourTeamLocked?: boolean;
  yourTeamLockedMessage?: string;
  faq: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
  footer: {
    contactEmail: string;
    contactPhone: string;
    address: string;
    copyright: string;
    systemStatusText?: string;
    discord?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    poweredByName?: string;
    poweredByUrl?: string;
    poweredByPrefix?: string;
    [key: string]: unknown;
  };
  registrationForm?: {
    isOpen?: boolean;
    title?: string;
    subtitle?: string;
    noticeBanner?: string;
    closedMessage?: string;
    minMembers?: number;
    maxMembers?: number;
    requireGithub?: boolean;
    termsText?: string;
    submitButtonText?: string;
    allowSolo?: boolean;
    [key: string]: unknown;
  };
  challenges?: Array<{
    id: string;
    number?: string;
    title: string;
    category: string;
    difficulty?: string;
    shortDescription?: string;
    problemStatement?: string;
    requirements?: string[];
    rules?: string[];
    rulesPdfUrl?: string;
    recommendedTech?: string[];
    prizePool?: string;
    firstPrize?: string;
    secondPrize?: string;
    bountyNotes?: string;
    [key: string]: unknown;
  }>;
  timeline?: Array<{
    id: string;
    day: string;
    time: string;
    title: string;
    description: string;
    milestone?: boolean;
    [key: string]: unknown;
  }>;
  partners?: Array<{
    id?: string;
    name: string;
    tier: string;
    category?: string;
    perk?: string;
    logo?: string;
    logoUrl?: string;
    websiteUrl?: string;
    [key: string]: unknown;
  }>;
  sponsors?: Array<{
    id?: string;
    name: string;
    tier: string;
    category?: string;
    logo?: string;
    logoUrl?: string;
    websiteUrl?: string;
    [key: string]: unknown;
  }>;
  gallery?: Array<{
    id: string;
    title: string;
    category: string;
    image: string;
    caption?: string;
    [key: string]: unknown;
  }>;
  loadingScreen?: {
    enabled?: boolean;
    logoUrl?: string;
    showLogo?: boolean;
    presentsText?: string;
    titleGothic?: string;
    titleAccent?: string;
    tagline?: string;
    durationMs?: number;
    allowSkip?: boolean;
    [key: string]: unknown;
  };
  adminSettings?: {
    email?: string;
    passcode?: string;
    [key: string]: unknown;
  };
  howItWorks?: Array<{
    id: string;
    number: string;
    title: string;
    tagline: string;
    description: string;
    iconName: string;
    [key: string]: unknown;
  }>;
  finalCta?: {
    badge?: string;
    title?: string;
    titleAccent?: string;
    description?: string;
    registerLabel?: string;
    browseLabel?: string;
    [key: string]: unknown;
  };
  contact?: ContactContent;
  registrations?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export const initialFallbackContent: SiteContent = {
  eventInfo: {
    name: "TECHXERA HACKFEST '26",
    shortName: "HACKFEST '26",
    titleGothic: "𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0",
    titleAccent: "2026",
    tagline: "BUILD. BREAK. INNOVATE.",
    dates: "OCTOBER 16 – 18, 2026",
    venue: "Government College of Engineering Kalahandi",
    location: "Bhawanipatna, Odisha",
    prizePool: "₹1,50,000+",
    hours: 24,
    participants: 200,
    edition: "EDITION 04"
  },
  eventControl: {
    countdownTargetDate: "2026-10-16T09:00:00Z",
    battlegroundsLocked: false,
    battlegroundsLockedMessage: "BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.",
    sponsorsLocked: false,
    sponsorsLockedMessage: "SPONSOR ALLIANCES ARE CURRENTLY CLASSIFIED. OFFICIAL PARTNERS WILL BE UNVEILED CLOSER TO LAUNCH.",
    yourTeamLocked: false,
    yourTeamLockedMessage: "TEAM ROSTER IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE."
  },
  battlegrounds: {
    title: "Battlegrounds",
    subtitle: "SYNTHARA2.0",
    description: "Five elite combat domains. Choose your battleground wisely — each track tests a different dimension of engineering mastery. Only the most prepared squads will claim the bounty.",
    tracksCount: "5",
    prizePool: "1,50,000+",
    duration: "24 HOURS",
    teamSize: "2-4 WARRIORS",
    bottomCtaText: "CANT DECIDE? REGISTER AND PICK YOUR TRACK ON ARRIVAL.",
    bottomCtaButton: "JOIN THE BATTLE - ITS FREE"
  },
  hero: {
    titleGothic: "𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0",
    titleAccent: "2026",
    subheadline: "WHERE WARRIORS CODE // 24 HOURS OF CODE, HARDWARE & INTELLIGENCE",
    description: "Assemble your squad of 2 to 4 engineers at the Government College of Engineering Kalahandi bamboo arena. Non-stop battleground programming, classified quests, and ₹1,50,000+ bounty pool.",
    seatsClaimed: 184,
    seatsTotal: 200,
    capText: "92% CAP // WARRIORS STANDING BY",
    joinBattleLabel: "JOIN THE BATTLE",
    battlegroundsLabel: "BATTLEGROUNDS",
    timelineLabel: "TIMELINE"
  },
  navbar: {
    brandName: "SYNTHARA2.0",
    brandAccent: "",
    brandSubline: "BATTLEGROUND // GCEK",
    siteLogoUrl: ""
  },
  mission: {
    badge: "INTEL BRIEF // THE CODEBREAKERS DOCTRINE",
    title: "The Arena of Pure Engineering",
    description: "Forged in the heart of Kalahandi, SYNTHARA2.0 unites 200 of the nation's elite developers, security researchers, and systems architects for an unrelenting 24-hour sprint. Build real solutions, challenge the status quo, and forge your legacy.",
    pillar1Title: "BATTLE TESTED",
    pillar1Desc: "Live evaluation under intense pressure and real-time adversary simulations.",
    pillar2Title: "NO SLEEP CODE",
    pillar2Desc: "24 continuous hours of architecture design, prototyping, and deployment.",
    pillar3Title: "REAL IMPACT",
    pillar3Desc: "Solve mission-critical problem statements with industry mentors and partners."
  },
  stats: {
    hours: "24H",
    hoursLabel: "COMBAT DURATION",
    hoursSub: "NON-STOP SPRINT",
    prizePool: "₹1.5L+",
    prizePoolLabel: "TOTAL BOUNTY POOL",
    prizePoolSub: "GRANTS & CREDITS",
    hackers: "200+",
    hackersLabel: "ELITE WARRIORS",
    hackersSub: "SELECTIVE SCREENING",
    tracks: "5",
    tracksLabel: "BATTLEGROUND TRACKS",
    tracksSub: "CROSS-DOMAIN"
  },
  prizes: {
    poolTotal: "₹1,50,000+",
    first: "₹50,000",
    firstSubtitle: "+ VC BACKING & INCUBATION",
    firstDesc: "The grand victor of SYNTHARA2.0. Direct cash grant wire, official SYNTHARA2.0 champion trophy, and VC investor term-sheet screening.",
    second: "₹30,000",
    secondSubtitle: "+ CLOUD CREDITS",
    secondDesc: "Runner up champions of the arena. Direct cash wire, cloud compute grant package, and silver trophy.",
    third: "₹20,000",
    thirdSubtitle: "+ MENTORSHIP & SWAG",
    thirdDesc: "Second runner up. Direct cash bounty wire, hardware developer toolkits, and bronze trophy.",
    special: "₹50,000",
    specialSubtitle: "TRACK BOUNTIES",
    specialDesc: "Best All-Women Squad, Best Freshman Hack, Best Hardware Integration, and Community Choice."
  },
  teams: [],
  yourTeam: [
    {
      id: "yt-1",
      name: "Raghab Barik",
      image: "",
      designationTechxera: "Core Developer & Lead",
      designationSynthara: "Platform Architect & Technical Head",
      category: "LEADERSHIP",
      linkedinUrl: "https://raghabportfolio.in",
      githubUrl: "",
      instagramUrl: "",
    },
  ],
  yourTeamCategories: [
    "LEADERSHIP",
    "CORE CREW",
    "TECHNICAL",
    "OPERATIONS",
    "CREATIVE & DESIGN"
  ],
  yourTeamLocked: false,
  yourTeamLockedMessage: "TEAM ROSTER IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.",
  faq: [],
  footer: {
    contactEmail: "codebreakers@gcekbpatna.ac.in",
    contactPhone: "+91 98765 43210",
    address: "Government College of Engineering Kalahandi, Bhawanipatna, Odisha - 766002",
    copyright: "© 2026 SYNTHARA2.0 // CODEBREAKERS CLUB GCEK. ALL RIGHTS RESERVED.",
    systemStatusText: "SYSTEM STATUS: REGISTRATIONS OPEN",
    discord: "https://discord.gg",
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    poweredByName: "Raghab Barik",
    poweredByUrl: "https://raghabportfolio.in",
    poweredByPrefix: "Powered by:"
  },
  registrationForm: {
    isOpen: true,
    title: "WARRIOR REGISTRATION // SQUAD ENLISTMENT",
    subtitle: "Enlist your squad for SYNTHARA2.0. Offline battleground at GCEK Kalahandi.",
    noticeBanner: "⚡ FREE REGISTRATION — MEALS, SWAGS & DORM ACCOMMODATION PROVIDED",
    closedMessage: "Registrations for SYNTHARA2.0 are currently closed. Check back soon or contact support.",
    minMembers: 1,
    maxMembers: 4,
    requireGithub: false,
    termsText: "I certify that all squad members are active university students or researchers and agree to the battleground rules.",
    submitButtonText: "CONFIRM SQUAD ENLISTMENT",
    allowSolo: true
  },
  challenges: [],
  timeline: [],
  partners: [],
  sponsors: [],
  gallery: [],
  loadingScreen: {
    enabled: true,
    logoUrl: "",
    showLogo: true,
    presentsText: "TECHXERA PRESENTS",
    titleGothic: "𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0",
    titleAccent: "2026",
    tagline: "BUILD THE FUTURE • ENTER THE ARENA",
    durationMs: 1500,
    allowSkip: true
  },
  adminSettings: {
    email: "techxerahack@gmail.com",
    passcode: "Techxera@gmail.2026"
  },
  howItWorks: [
    { id: 'hiw-01', number: '01', title: 'REGISTER', tagline: 'Enter the Shadow Arena', description: 'Claim your individual warrior credentials or recruit your preliminary cohort. Pass the screening gate to receive your encrypted arena pass.', iconName: 'UserCheck' },
    { id: 'hiw-02', number: '02', title: 'FORM YOUR SQUAD', tagline: 'Assemble 1 to 4 Warriors', description: 'Harmonize complemental combat skillsets across algorithmic intelligence, systems engineering, cryptography, and tactile interface craft.', iconName: 'Users' },
    { id: 'hiw-03', number: '03', title: 'CHOOSE YOUR BATTLEGROUND', tagline: 'Lock In One of 5 Arenas', description: 'Select your frontline domain: AI & Machine Learning, Digital Infrastructure, Cybersecurity, Cyber-Physical Robotics, or Open Innovation.', iconName: 'Crosshair' },
    { id: 'hiw-04', number: '04', title: 'BUILD', tagline: '48 Hours of Relentless Combat', description: 'Execute under the pressure of the clock. Forge architecture, write production tests, and deploy resilient containers with zero downtime.', iconName: 'Cpu' },
    { id: 'hiw-05', number: '05', title: 'GET MENTORED', tagline: 'Guidance from the Masters', description: 'Engage with veteran architects, distinguished researchers, and venture scouts to stress-test your design, throughput, and thesis.', iconName: 'Sparkles' },
    { id: 'hiw-06', number: '06', title: 'SUBMIT', tagline: 'Code Freeze & Repositories Locked', description: 'Commit your final builds to the immutable ledger. Verify live deployment endpoints, architectural blueprints, and demonstration videos.', iconName: 'ShieldCheck' },
    { id: 'hiw-07', number: '07', title: 'FACE THE FINAL JUDGING', tagline: 'Mainstage Showdown', description: 'Top squads demonstrate functioning prototypes live on the mainstage arena, facing rapid cross-examination from master judges.', iconName: 'Swords' },
    { id: 'hiw-08', number: '08', title: 'BECOME A CHAMPION', tagline: 'Glory & Prize Grant', description: 'Stand on the grand podium. Secure direct capital grants, cloud clusters, VC term-sheet pitches, and immortalize your squad.', iconName: 'Trophy' }
  ],
  finalCta: {
    badge: "OFFLINE REGISTRATION WINDOW IS LIVE",
    title: "READY TO ENTER",
    titleAccent: "SYNTHARA2.0?",
    description: "October 16, 2026 at Government College of Engineering Kalahandi. 24 hours of non-stop building, classified quests, and ₹1,50,000+ in rewards.",
    registerLabel: "REGISTER YOUR TEAM NOW",
    browseLabel: "BROWSE PROBLEM STATEMENTS"
  },
  contact: {
    title: "COMMUNICATIONS & COMMAND HQ",
    subtitle: "DIRECT HELPLINES // DISPATCH TRANSMISSION",
    description: "Have queries regarding hackathon battlegrounds, team registrations, travel coordinates, or partnership alliances? Connect directly with our operational coordinators below.",
    primaryEmail: "codebreakers@gcekbpatna.ac.in",
    secondaryEmail: "techxerahack@gmail.com",
    primaryPhone: "+91 98765 43210",
    secondaryPhone: "+91 91234 56789",
    whatsappNumber: "+91 98765 43210",
    whatsappLink: "https://wa.me/919876543210",
    venueName: "Government College of Engineering Kalahandi (GCEK)",
    address: "Bandopala, Bhawanipatna, Kalahandi, Odisha 766002",
    googleMapsUrl: "https://maps.google.com/?q=Government+College+of+Engineering+Kalahandi",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.428452309712!2d83.17646457597148!3d20.20038898124976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a23831818225579%3A0xe543fa7234661841!2sGovernment%20College%20of%20Engineering%2C%20Kalahandi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    timings: "24/7 Operations During Hackathon • Mon–Sat 9:00 AM – 7:00 PM IST",
    discordUrl: "https://discord.gg",
    contacts: [
      { id: "c1", name: "Lead Coordinator", role: "Event Lead & Registrations", phone: "+91 98765 43210", email: "lead@gcekbpatna.ac.in", whatsapp: "919876543210" },
      { id: "c2", name: "Technical Support", role: "Battlegrounds & Platform Queries", phone: "+91 91234 56789", email: "tech@gcekbpatna.ac.in", whatsapp: "919123456789" },
      { id: "c3", name: "Hospitality & Travel Desk", role: "Accommodation, Route & Campus Help", phone: "+91 99887 76655", email: "hospitality@gcekbpatna.ac.in", whatsapp: "919988776655" }
    ]
  },
  registrations: []
};

interface ContentContextType {
  content: SiteContent;
  refreshContent: () => Promise<void>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType>({
  content: initialFallbackContent,
  refreshContent: async () => {},
  loading: false,
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(initialFallbackContent);
  const [loading, setLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    // 1. Try fetching from Supabase Cloud Database first
    try {
      const { data: sbRow, error: sbErr } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'hackverse_2026')
        .maybeSingle();

      if (!sbErr && sbRow?.content && typeof sbRow.content === 'object') {
        const data = sbRow.content as Record<string, any>;
        setContent((prev) => ({
          ...prev,
          ...data,
          eventInfo: { ...prev.eventInfo, ...(data.eventInfo || {}) },
          eventControl: { ...prev.eventControl, ...(data.eventControl || {}) },
          hero: { ...prev.hero, ...(data.hero || {}) },
          navbar: { ...prev.navbar, ...(data.navbar || {}) },
          mission: { ...prev.mission, ...(data.mission || {}) },
          stats: { ...prev.stats, ...(data.stats || {}) },
          prizes: { ...prev.prizes, ...(data.prizes || {}) },
          footer: { ...prev.footer, ...(data.footer || {}) },
          registrationForm: { ...prev.registrationForm, ...(data.registrationForm || {}) },
          battlegrounds: { ...prev.battlegrounds, ...(data.battlegrounds || {}) },
          challenges: Array.isArray(data.challenges) ? data.challenges : prev.challenges,
          timeline: Array.isArray(data.timeline) ? data.timeline : prev.timeline,
          partners: Array.isArray(data.partners) ? data.partners : (Array.isArray(data.sponsors) ? data.sponsors : prev.partners),
          sponsors: Array.isArray(data.partners) ? data.partners : (Array.isArray(data.sponsors) ? data.sponsors : prev.sponsors),
          adminSettings: { ...prev.adminSettings, ...(data.adminSettings || {}) },
          loadingScreen: { ...prev.loadingScreen, ...(data.loadingScreen || {}) },
          teams: Array.isArray(data.teams) ? data.teams : prev.teams,
          yourTeam: Array.isArray(data.yourTeam) ? data.yourTeam : (Array.isArray(prev.yourTeam) ? prev.yourTeam : initialFallbackContent.yourTeam),
          yourTeamCategories: Array.isArray(data.yourTeamCategories) ? data.yourTeamCategories : (Array.isArray(prev.yourTeamCategories) ? prev.yourTeamCategories : initialFallbackContent.yourTeamCategories),
          yourTeamLocked: typeof data.yourTeamLocked === 'boolean'
            ? data.yourTeamLocked
            : (typeof data.eventControl?.yourTeamLocked === 'boolean'
              ? data.eventControl.yourTeamLocked
              : (prev.yourTeamLocked ?? false)),
          yourTeamLockedMessage: typeof data.yourTeamLockedMessage === 'string'
            ? data.yourTeamLockedMessage
            : (typeof data.eventControl?.yourTeamLockedMessage === 'string'
              ? data.eventControl.yourTeamLockedMessage
              : (prev.yourTeamLockedMessage ?? "TEAM ROSTER IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.")),
          faq: Array.isArray(data.faq) ? data.faq : prev.faq,
          howItWorks: Array.isArray(data.howItWorks) ? data.howItWorks : prev.howItWorks,
          gallery: Array.isArray(data.gallery) ? data.gallery : prev.gallery,
          contact: { ...prev.contact, ...(data.contact || {}) },
          finalCta: { ...prev.finalCta, ...(data.finalCta || {}) },
        }));
        setLoading(false);
        return;
      }
    } catch (sbErr) {
      console.warn('Supabase content fetch notice, trying local API:', sbErr);
    }

    // 2. Fallback to local server API / content.json
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          setContent((prev) => ({
            ...prev,
            ...data,
            eventInfo: { ...prev.eventInfo, ...(data.eventInfo || {}) },
            eventControl: { ...prev.eventControl, ...(data.eventControl || {}) },
            hero: { ...prev.hero, ...(data.hero || {}) },
            navbar: { ...prev.navbar, ...(data.navbar || {}) },
            mission: { ...prev.mission, ...(data.mission || {}) },
            stats: { ...prev.stats, ...(data.stats || {}) },
            prizes: { ...prev.prizes, ...(data.prizes || {}) },
            footer: { ...prev.footer, ...(data.footer || {}) },
            registrationForm: { ...prev.registrationForm, ...(data.registrationForm || {}) },
            battlegrounds: { ...prev.battlegrounds, ...(data.battlegrounds || {}) },
            challenges: Array.isArray(data.challenges) ? data.challenges : prev.challenges,
            timeline: Array.isArray(data.timeline) ? data.timeline : prev.timeline,
            partners: Array.isArray(data.partners) ? data.partners : (Array.isArray(data.sponsors) ? data.sponsors : prev.partners),
            sponsors: Array.isArray(data.partners) ? data.partners : (Array.isArray(data.sponsors) ? data.sponsors : prev.sponsors),
            adminSettings: { ...prev.adminSettings, ...(data.adminSettings || {}) },
            loadingScreen: { ...prev.loadingScreen, ...(data.loadingScreen || {}) },
            teams: Array.isArray(data.teams) ? data.teams : prev.teams,
            yourTeam: Array.isArray(data.yourTeam) ? data.yourTeam : (Array.isArray(prev.yourTeam) ? prev.yourTeam : initialFallbackContent.yourTeam),
          yourTeamCategories: Array.isArray(data.yourTeamCategories) ? data.yourTeamCategories : (Array.isArray(prev.yourTeamCategories) ? prev.yourTeamCategories : initialFallbackContent.yourTeamCategories),
          yourTeamLocked: typeof data.yourTeamLocked === 'boolean'
            ? data.yourTeamLocked
            : (typeof data.eventControl?.yourTeamLocked === 'boolean'
              ? data.eventControl.yourTeamLocked
              : (prev.yourTeamLocked ?? false)),
          yourTeamLockedMessage: typeof data.yourTeamLockedMessage === 'string'
            ? data.yourTeamLockedMessage
            : (typeof data.eventControl?.yourTeamLockedMessage === 'string'
              ? data.eventControl.yourTeamLockedMessage
              : (prev.yourTeamLockedMessage ?? "TEAM ROSTER IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.")),
            faq: Array.isArray(data.faq) ? data.faq : prev.faq,
            howItWorks: Array.isArray(data.howItWorks) ? data.howItWorks : prev.howItWorks,
            gallery: Array.isArray(data.gallery) ? data.gallery : prev.gallery,
            contact: { ...prev.contact, ...(data.contact || {}) },
            finalCta: { ...prev.finalCta, ...(data.finalCta || {}) },
          }));
        }
      }
    } catch (err) {
      console.warn('API content fetch notice: using built-in content state.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();

    // Supabase Realtime Channel: Listen for immediate database updates across all clients
    let channel: any = null;
    try {
      channel = supabase
        .channel('public:site_content_live')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_content' },
          (payload) => {
            if (payload?.new && (payload.new as any)?.content) {
              const data = (payload.new as any).content;
              setContent((prev) => ({
                ...prev,
                ...data,
                eventInfo: { ...prev.eventInfo, ...(data.eventInfo || {}) },
                eventControl: { ...prev.eventControl, ...(data.eventControl || {}) },
                hero: { ...prev.hero, ...(data.hero || {}) },
                navbar: { ...prev.navbar, ...(data.navbar || {}) },
                mission: { ...prev.mission, ...(data.mission || {}) },
                stats: { ...prev.stats, ...(data.stats || {}) },
                prizes: { ...prev.prizes, ...(data.prizes || {}) },
                footer: { ...prev.footer, ...(data.footer || {}) },
                registrationForm: { ...prev.registrationForm, ...(data.registrationForm || {}) },
                battlegrounds: { ...prev.battlegrounds, ...(data.battlegrounds || {}) },
                challenges: Array.isArray(data.challenges) ? data.challenges : prev.challenges,
                timeline: Array.isArray(data.timeline) ? data.timeline : prev.timeline,
                partners: Array.isArray(data.partners) ? data.partners : (Array.isArray(data.sponsors) ? data.sponsors : prev.partners),
                sponsors: Array.isArray(data.partners) ? data.partners : (Array.isArray(data.sponsors) ? data.sponsors : prev.sponsors),
                adminSettings: { ...prev.adminSettings, ...(data.adminSettings || {}) },
                loadingScreen: { ...prev.loadingScreen, ...(data.loadingScreen || {}) },
                teams: Array.isArray(data.teams) ? data.teams : prev.teams,
                yourTeam: Array.isArray(data.yourTeam) ? data.yourTeam : (Array.isArray(prev.yourTeam) ? prev.yourTeam : initialFallbackContent.yourTeam),
          yourTeamCategories: Array.isArray(data.yourTeamCategories) ? data.yourTeamCategories : (Array.isArray(prev.yourTeamCategories) ? prev.yourTeamCategories : initialFallbackContent.yourTeamCategories),
          yourTeamLocked: typeof data.yourTeamLocked === 'boolean'
            ? data.yourTeamLocked
            : (typeof data.eventControl?.yourTeamLocked === 'boolean'
              ? data.eventControl.yourTeamLocked
              : (prev.yourTeamLocked ?? false)),
          yourTeamLockedMessage: typeof data.yourTeamLockedMessage === 'string'
            ? data.yourTeamLockedMessage
            : (typeof data.eventControl?.yourTeamLockedMessage === 'string'
              ? data.eventControl.yourTeamLockedMessage
              : (prev.yourTeamLockedMessage ?? "TEAM ROSTER IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.")),
                faq: Array.isArray(data.faq) ? data.faq : prev.faq,
                howItWorks: Array.isArray(data.howItWorks) ? data.howItWorks : prev.howItWorks,
                gallery: Array.isArray(data.gallery) ? data.gallery : prev.gallery,
                contact: { ...prev.contact, ...(data.contact || {}) },
                finalCta: { ...prev.finalCta, ...(data.finalCta || {}) },
              }));
            } else {
              refreshContent();
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn("Realtime subscription notice:", e);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [refreshContent]);

  return (
    <ContentContext.Provider value={{ content, refreshContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(ContentContext);
