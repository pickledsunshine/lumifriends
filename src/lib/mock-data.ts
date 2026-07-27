/**
 * Central mock-data layer — spec §6.
 * Every screen reads from here, so this module can be swapped for an API client
 * without touching a single component.
 */

export type Partner = {
  id: string;
  displayName: string;
  initials: string;
  partnerType: "venue" | "influencer";
  venueType?: "cafe" | "hotel" | "hostel" | "coworking";
  partnerLabel: string;
  referralCode: string;
  referralLink: string;
  status: "active";
  referenceTarget: number;
  targetPeriodDays: number;
  rewardPerActivationVnd: number;
  payoutSchedule: string;
  passwordLastChanged: string;
};

export type ActivationStatus = "valid" | "under_review";
export type PayoutStatus = "accruing" | "pending_review" | "scheduled" | "paid";
export type ReferenceStatus = "within_target" | "above_target";

export type ActivatedUser = {
  id: string;
  displayName: string;
  activatedAt: string;
  activationStatus: ActivationStatus;
  payoutStatus: PayoutStatus;
  referenceStatus: ReferenceStatus;
  partnerRewardVnd: number | null;
  payoutCycleId: string | null;
};

export type PayoutCycleStatus = "accruing" | "scheduled" | "paid";

export type PayoutCycle = {
  id: string;
  reference: string;
  cycleStart: string;
  cycleEnd: string;
  validActivationCount: number;
  amountVnd: number;
  approximateAmountEur?: number;
  status: PayoutCycleStatus;
  expectedPayoutAt?: string;
  paidAt?: string | null;
};

export const partner: Partner = {
  id: "partner-xin-chao",
  displayName: "Xin Chào Hostel",
  initials: "XC",
  partnerType: "venue",
  venueType: "hostel",
  partnerLabel: "Hostel partner",
  referralCode: "XINCHAO100",
  referralLink: "https://lumifin.io/join/XINCHAO100",
  status: "active",
  referenceTarget: 100,
  targetPeriodDays: 14,
  rewardPerActivationVnd: 100000,
  payoutSchedule: "Every two weeks",
  passwordLastChanged: "2026-04-12",
};

export const REWARD_PER_ACTIVATION_VND = partner.rewardPerActivationVnd;

/** Indicative conversion used only for the smaller secondary EUR figures. */
const VND_PER_EUR = 26800;

export function approximateEur(amountVnd: number): number {
  return Math.round(amountVnd / VND_PER_EUR);
}

/**
 * Cycle metadata. The two July cycles have per-activation records, so their
 * counts and amounts are derived further down rather than written by hand —
 * that is what keeps the KPI, the table and the payout figure in agreement.
 */
type CycleSeed = Omit<PayoutCycle, "validActivationCount" | "amountVnd" | "approximateAmountEur">;

export const CURRENT_CYCLE_ID = "cycle-2026-07-b";
export const PREVIOUS_CYCLE_ID = "cycle-2026-07-a";

const cycleSeeds: CycleSeed[] = [
  {
    id: CURRENT_CYCLE_ID,
    reference: "LMF-P-023",
    cycleStart: "2026-07-15",
    cycleEnd: "2026-07-28",
    status: "accruing",
    expectedPayoutAt: "2026-07-30",
    paidAt: null,
  },
  {
    id: PREVIOUS_CYCLE_ID,
    reference: "LMF-P-022",
    cycleStart: "2026-07-01",
    cycleEnd: "2026-07-14",
    status: "paid",
    paidAt: "2026-07-16",
  },
];

/** Older cycles predate the record-level dataset, so their totals stand alone. */
const archivedCycles: PayoutCycle[] = [
  {
    id: "cycle-2026-06-b",
    reference: "LMF-P-021",
    cycleStart: "2026-06-17",
    cycleEnd: "2026-06-30",
    validActivationCount: 18,
    amountVnd: 1800000,
    approximateAmountEur: 67,
    status: "paid",
    paidAt: "2026-07-02",
  },
  {
    id: "cycle-2026-06-a",
    reference: "LMF-P-020",
    cycleStart: "2026-06-03",
    cycleEnd: "2026-06-16",
    validActivationCount: 21,
    amountVnd: 2100000,
    approximateAmountEur: 78,
    status: "paid",
    paidAt: "2026-06-18",
  },
];

/** Daily activations for the current 14-day cycle. Totals 34 — spec §6. */
export const dailyActivations = [
  { date: "15 Jul", activations: 1 },
  { date: "16 Jul", activations: 2 },
  { date: "17 Jul", activations: 1 },
  { date: "18 Jul", activations: 3 },
  { date: "19 Jul", activations: 2 },
  { date: "20 Jul", activations: 4 },
  { date: "21 Jul", activations: 2 },
  { date: "22 Jul", activations: 3 },
  { date: "23 Jul", activations: 4 },
  { date: "24 Jul", activations: 2 },
  { date: "25 Jul", activations: 3 },
  { date: "26 Jul", activations: 3 },
  { date: "27 Jul", activations: 4 },
  { date: "28 Jul", activations: 0 },
];

/**
 * The five records written out in the spec. The rest of the cycle is filled in
 * below so that the daily chart, the KPI count and the table all agree on 34.
 */
const namedActivations: ActivatedUser[] = [
  {
    id: "activation-1001",
    displayName: "Linh P.",
    activatedAt: "2026-07-27T11:42:00",
    activationStatus: "valid",
    payoutStatus: "accruing",
    referenceStatus: "within_target",
    partnerRewardVnd: 100000,
    payoutCycleId: "cycle-2026-07-b",
  },
  {
    id: "activation-1002",
    displayName: "Marc D.",
    activatedAt: "2026-07-27T09:18:00",
    activationStatus: "valid",
    payoutStatus: "accruing",
    referenceStatus: "within_target",
    partnerRewardVnd: 100000,
    payoutCycleId: "cycle-2026-07-b",
  },
  {
    id: "activation-1003",
    displayName: "Sofia R.",
    activatedAt: "2026-07-26T18:05:00",
    activationStatus: "valid",
    payoutStatus: "accruing",
    referenceStatus: "within_target",
    partnerRewardVnd: 100000,
    payoutCycleId: "cycle-2026-07-b",
  },
  {
    id: "activation-1004",
    displayName: "User LV-1028",
    activatedAt: "2026-07-25T15:31:00",
    activationStatus: "under_review",
    payoutStatus: "pending_review",
    referenceStatus: "within_target",
    partnerRewardVnd: null,
    payoutCycleId: null,
  },
  {
    id: "activation-1005",
    displayName: "Thomas B.",
    activatedAt: "2026-07-24T12:17:00",
    activationStatus: "valid",
    payoutStatus: "accruing",
    referenceStatus: "within_target",
    partnerRewardVnd: 100000,
    payoutCycleId: "cycle-2026-07-b",
  },
];

/**
 * Guest names are shown as first name plus last initial, or an anonymised ID.
 * No further personal data is ever exposed to a partner — spec §7.4.
 */
const guestNames = [
  "Emma L.",
  "Duc T.",
  "Chiara V.",
  "Noah K.",
  "Minh H.",
  "Lucas F.",
  "Anna S.",
  "Hoang V.",
  "Elena M.",
  "Jonas W.",
  "Trang N.",
  "Pierre G.",
  "Isabel C.",
  "Khanh D.",
  "Mateo R.",
  "Freya B.",
  "Quan L.",
  "Louise A.",
  "Tobias H.",
  "Mai T.",
  "Nils P.",
  "Giulia D.",
  "Bao N.",
  "Clara J.",
  "Ravi S.",
  "Yuki O.",
  "Femke D.",
  "Andrei P.",
  "Thu A.",
  "Oscar N.",
];

/** Deterministic pseudo-random so the dataset is identical on every render. */
function seededValue(seed: number, max: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.floor((x - Math.floor(x)) * max);
}

function buildCycleActivations(
  cycle: CycleSeed,
  dayCounts: { dayIso: string; count: number }[],
  seeded: ActivatedUser[],
  idOffset: number,
): ActivatedUser[] {
  const rows: ActivatedUser[] = [];
  let generated = 0;

  for (const { dayIso, count } of dayCounts) {
    const seededForDay = seeded.filter((row) => row.activatedAt.startsWith(dayIso));
    rows.push(...seededForDay);

    for (let i = seededForDay.length; i < count; i += 1) {
      const seed = idOffset + generated;
      const hour = 8 + seededValue(seed, 14);
      const minute = seededValue(seed + 500, 60);
      const isPaidCycle = cycle.status === "paid";
      rows.push({
        id: `activation-${idOffset + generated}`,
        displayName: guestNames[(seed * 7) % guestNames.length],
        activatedAt: `${dayIso}T${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00`,
        activationStatus: "valid",
        payoutStatus: isPaidCycle ? "paid" : "accruing",
        referenceStatus: "within_target",
        partnerRewardVnd: REWARD_PER_ACTIVATION_VND,
        payoutCycleId: cycle.id,
      });
      generated += 1;
    }
  }

  return rows;
}

/** Descending day counts for 15–28 July, mirroring `dailyActivations`. */
const currentCycleDayCounts = [...dailyActivations]
  .reverse()
  .map(({ date, activations }) => {
    const day = Number.parseInt(date, 10);
    return { dayIso: `2026-07-${day.toString().padStart(2, "0")}`, count: activations };
  });

/** 26 activations across 1–14 July, all settled in the paid cycle. */
const previousCycleDayCounts = [
  2, 1, 3, 2, 1, 2, 3, 1, 2, 2, 1, 3, 2, 1,
]
  .map((count, index) => ({
    dayIso: `2026-07-${(14 - index).toString().padStart(2, "0")}`,
    count,
  }));

export const activatedUsers: ActivatedUser[] = [
  ...buildCycleActivations(cycleSeeds[0], currentCycleDayCounts, namedActivations, 2001),
  ...buildCycleActivations(cycleSeeds[1], previousCycleDayCounts, [], 3001),
];

export function activationsForCycle(cycleId: string): ActivatedUser[] {
  return activatedUsers.filter(
    (row) => row.payoutCycleId === cycleId || (row.payoutCycleId === null && cycleId === CURRENT_CYCLE_ID),
  );
}

/**
 * Money follows the records. Only valid activations carry a reward, so an
 * activation still under review never inflates the payout total (spec §12).
 */
function totalsForCycle(cycleId: string) {
  const rows = activationsForCycle(cycleId).filter((row) => row.activationStatus === "valid");
  const amountVnd = rows.reduce((total, row) => total + (row.partnerRewardVnd ?? 0), 0);
  return {
    validActivationCount: rows.length,
    amountVnd,
    approximateAmountEur: approximateEur(amountVnd),
  };
}

export const payoutCycles: PayoutCycle[] = [
  ...cycleSeeds.map((seed) => ({ ...seed, ...totalsForCycle(seed.id) })),
  ...archivedCycles,
];

export const currentCycle = payoutCycles[0];
export const previousCycle = payoutCycles[1];
export const payoutHistory = payoutCycles.filter((cycle) => cycle.status !== "accruing");

export const currentCycleActivations = activationsForCycle(CURRENT_CYCLE_ID);

export const currentCycleSummary = {
  total: currentCycleActivations.length,
  valid: currentCycleActivations.filter((row) => row.activationStatus === "valid").length,
  underReview: currentCycleActivations.filter((row) => row.activationStatus === "under_review").length,
};

/** Dashboard KPI copy — spec §7.3. */
export const activationsComparisonCopy = "8 more than last cycle at this point";

/**
 * Venue materials. `assetPath` points at a placeholder in `/public/materials`;
 * swapping in final artwork means replacing the file, not changing components.
 */
export type VenueMaterial = {
  id: string;
  name: string;
  recommendedUse: string;
  fileName: string;
  assetPath: string;
  accent: "purple" | "yellow";
  /** Preview aspect ratio, so each card hints at the real format. */
  aspect: string;
};

export const venueMaterials: VenueMaterial[] = [
  {
    id: "counter-qr-card",
    name: "Counter QR card",
    recommendedUse: "Perfect for check-in desks and payment counters.",
    fileName: "lumifriends-counter-qr-card.svg",
    assetPath: "/materials/counter-qr-card.svg",
    accent: "purple",
    aspect: "4 / 3",
  },
  {
    id: "a5-guest-flyer",
    name: "A5 guest flyer",
    recommendedUse: "Leave these in guest rooms or shared social spaces.",
    fileName: "lumifriends-a5-guest-flyer.svg",
    assetPath: "/materials/a5-guest-flyer.svg",
    accent: "yellow",
    aspect: "4 / 3",
  },
  {
    id: "window-poster",
    name: "Window or entrance poster",
    recommendedUse: "Attract new sign-ups directly from the street.",
    fileName: "lumifriends-window-poster.svg",
    assetPath: "/materials/window-poster.svg",
    accent: "purple",
    aspect: "4 / 3",
  },
  {
    id: "digital-story-asset",
    name: "Digital story asset",
    recommendedUse: "Ready-to-post assets for Instagram, Facebook and TikTok stories.",
    fileName: "lumifriends-digital-story.svg",
    assetPath: "/materials/digital-story.svg",
    accent: "yellow",
    aspect: "4 / 3",
  },
];

export const socialCaption = `Travelling in Vietnam? Use Lumifin to pay local merchants through VietQR without needing a local bank account. Join with our code ${partner.referralCode}.`;

export const supportLinks = [
  { id: "contact", label: "Contact Lumifin", description: "Reach your Lumifin representative." },
  { id: "guide", label: "Partner programme guide", description: "How the Lumifriends programme works." },
  { id: "privacy", label: "Privacy information", description: "What we share about activated users." },
  { id: "faq", label: "Frequently asked questions", description: "Answers to common partner questions." },
];
