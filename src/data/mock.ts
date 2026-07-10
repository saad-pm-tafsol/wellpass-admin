export type Category =
  | "Yoga" | "Pilates" | "Strength Training" | "CrossFit/HIIT" | "Swimming"
  | "Padel" | "Squash" | "Tennis" | "Meditation" | "Dance" | "Boxing"
  | "Cycling" | "Running" | "Stretching & Mobility";

export const CATEGORIES: { name: Category; icon: string }[] = [
  { name: "Yoga", icon: "🧘" },
  { name: "Pilates", icon: "🤸" },
  { name: "Strength Training", icon: "🏋️" },
  { name: "CrossFit/HIIT", icon: "🔥" },
  { name: "Swimming", icon: "🏊" },
  { name: "Padel", icon: "🎾" },
  { name: "Squash", icon: "🥎" },
  { name: "Tennis", icon: "🎾" },
  { name: "Meditation", icon: "🧠" },
  { name: "Dance", icon: "💃" },
  { name: "Boxing", icon: "🥊" },
  { name: "Cycling", icon: "🚴" },
  { name: "Running", icon: "🏃" },
  { name: "Stretching & Mobility", icon: "🤾" },
];

export type Studio = {
  id: string;
  name: string;
  category: Category;
  location: string;
  rating: number;
  reviews: number;
  members: number;
  email: string;
  phone: string;
  owner: string;
  description: string;
  amenities: string[];
  submittedAt: string;
  gradient: string;
};

export const STUDIOS: Studio[] = [
  { id: "zenith", name: "Zenith Pilates Partner", category: "Pilates", location: "Al Olaya, Riyadh", rating: 4.8, reviews: 184, members: 320,
    email: "hello@zenithpilates.sa", phone: "+966 50 210 4488", owner: "Mariam Al-Fahad",
    description: "Boutique reformer & mat Pilates partner with certified instructors and personalized programming.",
    amenities: ["Showers", "Lockers", "Wi-Fi", "Parking"], submittedAt: "2025-05-12", gradient: "from-violet-500 to-fuchsia-600" },
  { id: "ironcore", name: "IronCore Gym", category: "Strength Training", location: "Al Malaz, Riyadh", rating: 4.5, reviews: 312, members: 510,
    email: "ops@ironcore.sa", phone: "+966 55 310 9182", owner: "Hassan Al-Mutairi",
    description: "Heavy iron, real coaches. Programmed strength training with free weights and rigs.",
    amenities: ["Showers", "Lockers", "Parking", "Changing Rooms"], submittedAt: "2025-04-18", gradient: "from-zinc-700 to-zinc-900" },
  { id: "serene", name: "Serene Yoga Collective", category: "Yoga", location: "Al Nakheel, Riyadh", rating: 4.9, reviews: 221, members: 280,
    email: "namaste@sereneyoga.sa", phone: "+966 54 882 7710", owner: "Layla Hassan",
    description: "Vinyasa, Hatha, Yin and restorative yoga with a calm sun-filled partner.",
    amenities: ["Showers", "Lockers", "Wi-Fi", "Prayer Room"], submittedAt: "2025-05-03", gradient: "from-emerald-400 to-teal-600" },
  { id: "aquafit", name: "AquaFit Center", category: "Swimming", location: "Al Wurud, Riyadh", rating: 4.6, reviews: 142, members: 190,
    email: "booking@aquafit.sa", phone: "+966 56 440 2199", owner: "Tariq Al-Nasser",
    description: "Olympic lane pool with coached swim sessions and aqua fitness classes.",
    amenities: ["Showers", "Lockers", "Parking", "Changing Rooms"], submittedAt: "2025-05-20", gradient: "from-sky-400 to-blue-700" },
  { id: "padel", name: "Padel Pro Arena", category: "Padel", location: "Al Muhammadiyah, Riyadh", rating: 4.7, reviews: 298, members: 440,
    email: "play@padelpro.sa", phone: "+966 50 778 6504", owner: "Carlos Mendez", submittedAt: "2025-04-26",
    description: "Premium glass-walled padel courts, beginner to pro level coaching.",
    amenities: ["Showers", "Café", "Parking", "Pro Shop"], gradient: "from-lime-400 to-emerald-600" },
  { id: "flex", name: "FlexFusion Fitness", category: "CrossFit/HIIT", location: "Al Aqiq, Riyadh", rating: 4.4, reviews: 256, members: 360,
    email: "team@flexfusion.sa", phone: "+966 53 102 7735", owner: "Omar Saeed", submittedAt: "2025-05-28",
    description: "High-intensity functional fitness — CrossFit, HIIT, boxing and conditioning.",
    amenities: ["Showers", "Lockers", "Parking"], gradient: "from-orange-500 to-rose-600" },
  { id: "mindbody", name: "Mind & Body Wellness", category: "Meditation", location: "Al Sulaimaniyah, Riyadh", rating: 4.9, reviews: 98, members: 150,
    email: "care@mindbody.sa", phone: "+966 55 667 1820", owner: "Dr. Reem Al-Saud", submittedAt: "2025-06-02",
    description: "Mindfulness, meditation and breathwork in a tranquil environment.",
    amenities: ["Wi-Fi", "Prayer Room", "Café"], gradient: "from-indigo-400 to-purple-700" },
  { id: "squash", name: "Squash Republic", category: "Squash", location: "Al Rawdah, Riyadh", rating: 4.6, reviews: 167, members: 220,
    email: "courts@squashrepublic.sa", phone: "+966 54 331 9076", owner: "Fahad Al-Qahtani", submittedAt: "2025-05-09",
    description: "Glass-back squash courts with professional coaching and league play.",
    amenities: ["Showers", "Lockers", "Café", "Parking"], gradient: "from-red-500 to-amber-600" },
];

export type PendingStudio = {
  id: string;
  name: string;
  email: string;
  phone: string;
  owner: string;
  category: Category;
  location: string;
  description: string;
  amenities: string[];
  submittedAt: string;
};

export const PENDING_STUDIOS: PendingStudio[] = [
  { id: "powerlift", name: "PowerLift Athletics", email: "hello@powerlift.sa", phone: "+966 50 123 4567", owner: "Faisal Al-Harbi",
    category: "Strength Training", location: "Al Olaya, Riyadh",
    description: "Strength & conditioning facility with Olympic lifting platforms, competition racks and certified coaches.",
    amenities: ["Showers", "Lockers", "Parking", "Chalk Station"], submittedAt: "2025-06-28" },
  { id: "aercycle", name: "Aer Cycle Club", email: "join@aercycle.sa", phone: "+966 55 908 2211", owner: "Lina Al-Qahtani",
    category: "Cycling", location: "Al Hamra, Jeddah",
    description: "High-energy indoor cycling partner with rhythm rides, live DJ sessions and performance tracking.",
    amenities: ["Showers", "Lockers", "Wi-Fi", "Café"], submittedAt: "2025-06-29" },
  { id: "momentum", name: "Momentum CrossFit", email: "team@momentumcf.sa", phone: "+966 53 447 6690", owner: "Yousef Al-Ghamdi",
    category: "CrossFit/HIIT", location: "Al Aqiq, Riyadh",
    description: "CrossFit box with certified L2 coaches, daily WODs, olympic lifting and mobility programming.",
    amenities: ["Showers", "Lockers", "Parking"], submittedAt: "2025-06-30" },
  { id: "serenity", name: "Serenity Spa & Yoga", email: "hello@serenity.sa", phone: "+966 56 220 3388", owner: "Huda Al-Rashid",
    category: "Yoga", location: "Al Rakah, Al Khobar",
    description: "Calm boutique partner offering Hatha, Yin and restorative yoga plus guided meditation.",
    amenities: ["Showers", "Wi-Fi", "Prayer Room", "Café"], submittedAt: "2025-07-01" },
];

export type Plan = { id: string; name: string; credits: number; price: number; validityMonths: number; popular?: boolean; features?: string[] };
export const PLANS: Plan[] = [
  { id: "starter", name: "Starter Pack", credits: 50, price: 149, validityMonths: 1, features: ["Access to all partner studios", "Book up to 3 classes per day"] },
  { id: "active", name: "Active Pack", credits: 100, price: 249, validityMonths: 2, popular: true, features: ["Access to all partner studios", "Priority booking window", "Free class cancellations"] },
  { id: "elite", name: "Elite Pack", credits: 150, price: 349, validityMonths: 3, features: ["Access to all partner studios", "Priority booking window", "Free class cancellations", "Exclusive premium classes"] },
];

export type ClassItem = {
  id: string;
  name: string;
  studioId: string;
  instructor: string;
  day: "Today" | "Tomorrow";
  time: string;
  duration: number;
  credits: number;
  capacity: number;
  booked: number;
  category: Category;
  gender: "Mixed" | "Male" | "Female";
};

export const CLASSES: ClassItem[] = [
  { id: "c1", name: "Morning Flow Yoga", studioId: "serene", instructor: "Layla Hassan", day: "Tomorrow", time: "07:00", duration: 60, credits: 12, capacity: 20, booked: 14, category: "Yoga", gender: "Mixed" },
  { id: "c2", name: "Power Pilates Core", studioId: "zenith", instructor: "Mariam Khalid", day: "Today", time: "10:00", duration: 50, credits: 15, capacity: 15, booked: 12, category: "Pilates", gender: "Female" },
  { id: "c3", name: "HIIT Blast", studioId: "flex", instructor: "Omar Saeed", day: "Today", time: "18:00", duration: 45, credits: 10, capacity: 25, booked: 25, category: "CrossFit/HIIT", gender: "Mixed" },
  { id: "c4", name: "Padel Beginner Session", studioId: "padel", instructor: "Carlos Mendez", day: "Tomorrow", time: "08:00", duration: 90, credits: 20, capacity: 8, booked: 4, category: "Padel", gender: "Mixed" },
  { id: "c5", name: "Deep Stretch Recovery", studioId: "serene", instructor: "Layla Hassan", day: "Today", time: "17:00", duration: 45, credits: 8, capacity: 20, booked: 8, category: "Stretching & Mobility", gender: "Mixed" },
  { id: "c6", name: "Iron Strength 101", studioId: "ironcore", instructor: "Hassan Al-Mutairi", day: "Tomorrow", time: "07:30", duration: 60, credits: 12, capacity: 20, booked: 11, category: "Strength Training", gender: "Male" },
  { id: "c7", name: "Mindful Meditation", studioId: "mindbody", instructor: "Dr. Reem Al-Saud", day: "Today", time: "08:00", duration: 30, credits: 6, capacity: 10, booked: 3, category: "Meditation", gender: "Mixed" },
  { id: "c8", name: "Lap Swimming (Lane)", studioId: "aquafit", instructor: "Coach Tariq", day: "Tomorrow", time: "06:00", duration: 60, credits: 14, capacity: 8, booked: 6, category: "Swimming", gender: "Mixed" },
  { id: "c9", name: "Squash Open Court", studioId: "squash", instructor: "Pro Court", day: "Today", time: "16:00", duration: 45, credits: 16, capacity: 4, booked: 3, category: "Squash", gender: "Mixed" },
  { id: "c10", name: "Boxing Fundamentals", studioId: "flex", instructor: "Coach Mike", day: "Tomorrow", time: "09:00", duration: 60, credits: 12, capacity: 15, booked: 7, category: "Boxing", gender: "Mixed" },
];

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Rejected" | "No-Show";

export type Booking = {
  ref: string;
  customer: string;
  classId: string;
  status: BookingStatus;
  type: "Credit" | "Independent";
  credits?: number;
  amount?: number;
  createdAt: string;
  // Reason given for a cancellation (by the customer) or a rejection/no-show (by the partner).
  reason?: string;
  reasonBy?: "Customer" | "Partner";
};

export const BOOKINGS: Booking[] = [
  { ref: "WP-2025-04821", customer: "Sara Al-Hamdan", classId: "c2", status: "Confirmed", type: "Credit", credits: 15, createdAt: "2025-06-28 09:12" },
  { ref: "WP-2025-04820", customer: "Ahmed Al-Rashidi", classId: "c6", status: "Pending", type: "Credit", credits: 12, createdAt: "2025-06-28 08:42" },
  { ref: "WP-2025-04819", customer: "Fatima Al-Dosari", classId: "c1", status: "Confirmed", type: "Credit", credits: 12, createdAt: "2025-06-28 08:10" },
  { ref: "WP-2025-04818", customer: "Khalid Al-Shehri", classId: "c9", status: "Pending", type: "Independent", amount: 80, createdAt: "2025-06-28 07:55" },
  { ref: "WP-2025-04817", customer: "Noura Al-Otaibi", classId: "c5", status: "Confirmed", type: "Credit", credits: 8, createdAt: "2025-06-27 22:30" },
  { ref: "WP-2025-04816", customer: "Sara Al-Hamdan", classId: "c5", status: "Completed", type: "Credit", credits: 8, createdAt: "2025-06-26 17:00" },
  { ref: "WP-2025-04815", customer: "Ahmed Al-Rashidi", classId: "c3", status: "Completed", type: "Credit", credits: 10, createdAt: "2025-06-26 18:00" },
  { ref: "WP-2025-04814", customer: "Fatima Al-Dosari", classId: "c7", status: "Cancelled", type: "Credit", credits: 6, createdAt: "2025-06-25 08:00", reason: "Feeling unwell — had to cancel last minute.", reasonBy: "Customer" },
  { ref: "WP-2025-04813", customer: "Khalid Al-Shehri", classId: "c4", status: "Rejected", type: "Independent", amount: 100, createdAt: "2025-06-25 11:20", reason: "Class was fully booked at the requested time slot.", reasonBy: "Partner" },
];

export const CURRENT_CUSTOMER = {
  name: "Sara Al-Hamdan",
  email: "sara@example.com",
  plan: "Active Pack",
  credits: 78,
  totalCredits: 100,
  expires: "Jul 31, 2025",
  loyaltyPoints: 340,
  lifetimeEarned: 890,
  redeemed: 550,
  referralCode: "SARA2025",
  bookings: 12,
};

export const CUSTOMERS = [
  { name: "Sara Al-Hamdan", email: "sara@example.com", phone: "+966 50 884 2190", dateOfBirth: "1993-04-18", gender: "Female", nationality: "Saudi", city: "Riyadh", preferredLanguage: "English", joinedAt: "2025-01-12", referralCode: "SARA2025", marketingOptIn: true, plan: "Active Pack", credits: 78, bookings: 12, points: 340, status: "Active", lastBooking: "2026-06-28" },
  { name: "Ahmed Al-Rashidi", email: "ahmed@example.com", phone: "+966 55 129 7740", dateOfBirth: "1988-11-03", gender: "Male", nationality: "Saudi", city: "Riyadh", preferredLanguage: "Arabic", joinedAt: "2024-12-04", referralCode: "AHMED2025", marketingOptIn: true, plan: "Elite Pack", credits: 132, bookings: 28, points: 890, status: "Active", lastBooking: "2026-06-12" },
  { name: "Noura Al-Otaibi", email: "noura@example.com", phone: "+966 56 440 1182", dateOfBirth: "1997-07-26", gender: "Female", nationality: "Saudi", city: "Jeddah", preferredLanguage: "Arabic", joinedAt: "2025-03-19", referralCode: "NOURA2025", marketingOptIn: false, plan: "Starter Pack", credits: 22, bookings: 5, points: 120, status: "Blocked", lastBooking: "2026-02-25" },
  { name: "Khalid Al-Shehri", email: "khalid@example.com", plan: "—", credits: 0, bookings: 3, points: 60, status: "Active", lastBooking: "2026-02-18" },
  { name: "Fatima Al-Dosari", email: "fatima@example.com", phone: "+966 53 226 5801", dateOfBirth: "1995-09-09", gender: "Female", nationality: "Saudi", city: "Al Khobar", preferredLanguage: "Arabic", joinedAt: "2025-02-22", referralCode: "FATIMA2025", marketingOptIn: true, plan: "Active Pack", credits: 95, bookings: 9, points: 270, status: "Active", lastBooking: "2026-03-01" },
];

// A customer is "Non-active" if their most recent booking is more than 4 months
// old. A manually Blocked account always shows as Blocked regardless of activity.
export function isCustomerNonActive(lastBooking: string): boolean {
  const last = new Date(`${lastBooking}T00:00:00`);
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 4);
  return last < cutoff;
}

export function customerDisplayStatus(accountStatus: string, lastBooking: string): "Active" | "Non-active" | "Blocked" {
  if (accountStatus === "Blocked") return "Blocked";
  return isCustomerNonActive(lastBooking) ? "Non-active" : "Active";
}

export type LoyaltyHistoryEntry = {
  id: string;
  customerEmail: string;
  points: number;
  earnedAt: string;
  source: "Class attendance" | "Referral" | "Membership bonus" | "Promotion";
  reason: string;
};

export const LOYALTY_HISTORY: LoyaltyHistoryEntry[] = [
  { id: "lh-1", customerEmail: "sara@example.com", points: 10, earnedAt: "2026-01-10", source: "Class attendance", reason: "Attended Morning Flow Yoga" },
  { id: "lh-2", customerEmail: "sara@example.com", points: 20, earnedAt: "2026-01-20", source: "Referral", reason: "Friend joined using the referral code" },
  { id: "lh-3", customerEmail: "sara@example.com", points: 15, earnedAt: "2026-06-15", source: "Membership bonus", reason: "Annual membership loyalty bonus" },
  { id: "lh-4", customerEmail: "ahmed@example.com", points: 25, earnedAt: "2026-02-12", source: "Promotion", reason: "Weekend challenge reward" },
  { id: "lh-5", customerEmail: "ahmed@example.com", points: 40, earnedAt: "2026-06-18", source: "Class attendance", reason: "Completed strength training streak" },
  { id: "lh-6", customerEmail: "noura@example.com", points: 12, earnedAt: "2026-03-05", source: "Class attendance", reason: "Joined a guided meditation session" },
  { id: "lh-7", customerEmail: "khalid@example.com", points: 8, earnedAt: "2026-05-20", source: "Promotion", reason: "App onboarding reward" },
  { id: "lh-8", customerEmail: "fatima@example.com", points: 18, earnedAt: "2026-04-08", source: "Membership bonus", reason: "Loyalty reward for active plan" },
];

// Where loyalty points were spent: each redemption is tied to the booking the
// points were applied to, so the history page can show earning vs. usage.
export type LoyaltyRedemption = {
  id: string;
  customerEmail: string;
  points: number;
  redeemedAt: string;
  bookingRef: string;
  classId: string;
};

export const LOYALTY_REDEMPTIONS: LoyaltyRedemption[] = [
  { id: "lr-1", customerEmail: "sara@example.com", points: 20, redeemedAt: "2026-03-02", bookingRef: "WP-2025-04821", classId: "c2" },
  { id: "lr-2", customerEmail: "sara@example.com", points: 15, redeemedAt: "2026-06-28", bookingRef: "WP-2025-04816", classId: "c5" },
  { id: "lr-3", customerEmail: "ahmed@example.com", points: 30, redeemedAt: "2026-03-15", bookingRef: "WP-2025-04820", classId: "c6" },
  { id: "lr-4", customerEmail: "ahmed@example.com", points: 20, redeemedAt: "2026-06-25", bookingRef: "WP-2025-04815", classId: "c3" },
  { id: "lr-5", customerEmail: "noura@example.com", points: 10, redeemedAt: "2026-05-10", bookingRef: "WP-2025-04817", classId: "c5" },
  { id: "lr-6", customerEmail: "fatima@example.com", points: 12, redeemedAt: "2026-05-22", bookingRef: "WP-2025-04814", classId: "c7" },
];

export function getLoyaltyExpiryDate(earnedAt: string) {
  const [year, month, day] = earnedAt.split("-").map(Number);
  const expiry = new Date(year, month - 1, day);
  expiry.setMonth(expiry.getMonth() + 3);
  return expiry;
}

export function getLoyaltyStatus(earnedAt: string) {
  const expiry = getLoyaltyExpiryDate(earnedAt);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return expiry < startOfToday ? "Expired" : "Active";
}

export function studioById(id: string) {
  return STUDIOS.find((s) => s.id === id);
}
export function classById(id: string) {
  return CLASSES.find((c) => c.id === id);
}

// Revenue by source: independent bookings + membership package sales + partner
// subscription fees (studios paying to be listed on the platform).
export const REVENUE_WEEKLY = [
  { week: "W1", membership: 2400, independent: 1200, subscription: 600 }, { week: "W2", membership: 2600, independent: 1400, subscription: 650 },
  { week: "W3", membership: 2800, independent: 1500, subscription: 700 }, { week: "W4", membership: 3000, independent: 1600, subscription: 750 },
];
export const REVENUE_MONTHLY = [
  { month: "Jan", membership: 2400, independent: 1800, subscription: 1800 }, { month: "Feb", membership: 2700, independent: 2100, subscription: 1950 },
  { month: "Mar", membership: 3000, independent: 2400, subscription: 2100 }, { month: "Apr", membership: 3400, independent: 2700, subscription: 2300 },
  { month: "May", membership: 3800, independent: 3100, subscription: 2500 }, { month: "Jun", membership: 4200, independent: 3500, subscription: 2700 },
  { month: "Jul", membership: 4600, independent: 3900, subscription: 2900 }, { month: "Aug", membership: 5000, independent: 4300, subscription: 3100 },
  { month: "Sep", membership: 5400, independent: 4700, subscription: 3300 }, { month: "Oct", membership: 5800, independent: 5100, subscription: 3600 },
  { month: "Nov", membership: 6200, independent: 5500, subscription: 3900 }, { month: "Dec", membership: 6600, independent: 5900, subscription: 4200 },
];
export const REVENUE_YEARLY = [
  { year: "2021", membership: 28000, independent: 21000, subscription: 18000 }, { year: "2022", membership: 32000, independent: 24000, subscription: 21000 },
  { year: "2023", membership: 36000, independent: 27000, subscription: 24000 }, { year: "2024", membership: 40000, independent: 30000, subscription: 28000 }, { year: "2025", membership: 44000, independent: 33000, subscription: 32000 },
];
export const REGISTRATION_TRENDS = {
  weekly: [
    { label: "W1", customers: 82, studios: 2 }, { label: "W2", customers: 94, studios: 3 },
    { label: "W3", customers: 106, studios: 4 }, { label: "W4", customers: 118, studios: 5 },
  ],
  monthly: [
    { label: "Jan", customers: 312, studios: 7 }, { label: "Feb", customers: 336, studios: 8 }, { label: "Mar", customers: 348, studios: 8 },
    { label: "Apr", customers: 372, studios: 9 }, { label: "May", customers: 394, studios: 10 }, { label: "Jun", customers: 418, studios: 10 },
    { label: "Jul", customers: 442, studios: 11 }, { label: "Aug", customers: 466, studios: 12 }, { label: "Sep", customers: 490, studios: 12 },
    { label: "Oct", customers: 514, studios: 13 }, { label: "Nov", customers: 538, studios: 14 }, { label: "Dec", customers: 562, studios: 15 },
  ],
  yearly: [
    { label: "2021", customers: 1820, studios: 32 }, { label: "2022", customers: 2140, studios: 38 },
    { label: "2023", customers: 2470, studios: 44 }, { label: "2024", customers: 2810, studios: 51 }, { label: "2025", customers: 3160, studios: 58 },
  ],
};

// Individual membership package purchases (transaction log).
export type MembershipPurchase = {
  id: string;
  customer: string;
  plan: string;
  amount: number;
  purchasedAt: string;
  status: "Completed" | "Pending";
};

export const MEMBERSHIP_PURCHASES: MembershipPurchase[] = [
  { id: "MP-2025-1042", customer: "Ahmed Al-Rashidi", plan: "Elite Pack", amount: 349, purchasedAt: "2025-06-20", status: "Completed" },
  { id: "MP-2025-1041", customer: "Sara Al-Hamdan", plan: "Active Pack", amount: 249, purchasedAt: "2025-06-25", status: "Completed" },
  { id: "MP-2025-1040", customer: "Fatima Al-Dosari", plan: "Active Pack", amount: 249, purchasedAt: "2025-06-22", status: "Completed" },
  { id: "MP-2025-1039", customer: "Noura Al-Otaibi", plan: "Starter Pack", amount: 149, purchasedAt: "2025-06-18", status: "Pending" },
  { id: "MP-2025-1012", customer: "Ahmed Al-Rashidi", plan: "Elite Pack", amount: 349, purchasedAt: "2025-05-20", status: "Completed" },
  { id: "MP-2025-1011", customer: "Sara Al-Hamdan", plan: "Active Pack", amount: 249, purchasedAt: "2025-05-25", status: "Completed" },
];
export const PLATFORM_DAILY = [
  { day: "Mon", customers: 24, studios: 0 }, { day: "Tue", customers: 31, studios: 1 },
  { day: "Wed", customers: 18, studios: 0 }, { day: "Thu", customers: 42, studios: 1 },
  { day: "Fri", customers: 56, studios: 0 }, { day: "Sat", customers: 64, studios: 2 },
  { day: "Sun", customers: 38, studios: 0 },
];

export const NOTIFICATIONS = [
  { id: 1, type: "success", title: "Booking Confirmed", body: "Your Power Pilates Core class at Zenith Pilates is confirmed for tomorrow 10:00 AM. Reference: WP-2025-04821", time: "2h ago", unread: true },
  { id: 3, type: "error", title: "Booking Rejected", body: "Squash Republic has declined your booking for today 4:00 PM.", time: "5h ago", unread: false },
  { id: 4, type: "success", title: "Credits Refunded", body: "15 credits have been returned to your account. Booking: WP-2025-04760", time: "Yesterday", unread: false },
  { id: 5, type: "info", title: "Loyalty Points Earned", body: "You earned 10 points for attending Morning Flow Yoga! Total: 340 pts", time: "Yesterday", unread: false },
  { id: 6, type: "info", title: "Referral Reward", body: "Your friend Ahmed joined using your code! You earned 75 bonus points.", time: "2 days ago", unread: false },
  { id: 7, type: "default", title: "Membership Renewal Reminder", body: "Your Active Pack renews in 7 days on Jul 31. SAR 249 will be charged.", time: "3 days ago", unread: false },
];
