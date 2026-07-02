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
  description: string;
  amenities: string[];
  gradient: string;
};

export const STUDIOS: Studio[] = [
  { id: "zenith", name: "Zenith Pilates Studio", category: "Pilates", location: "Al Olaya, Riyadh", rating: 4.8, reviews: 184, members: 320,
    description: "Boutique reformer & mat Pilates studio with certified instructors and personalized programming.",
    amenities: ["Showers", "Lockers", "Wi-Fi", "Parking"], gradient: "from-violet-500 to-fuchsia-600" },
  { id: "ironcore", name: "IronCore Gym", category: "Strength Training", location: "Al Malaz, Riyadh", rating: 4.5, reviews: 312, members: 510,
    description: "Heavy iron, real coaches. Programmed strength training with free weights and rigs.",
    amenities: ["Showers", "Lockers", "Parking", "Changing Rooms"], gradient: "from-zinc-700 to-zinc-900" },
  { id: "serene", name: "Serene Yoga Collective", category: "Yoga", location: "Al Nakheel, Riyadh", rating: 4.9, reviews: 221, members: 280,
    description: "Vinyasa, Hatha, Yin and restorative yoga in a calm sun-filled studio.",
    amenities: ["Showers", "Lockers", "Wi-Fi", "Prayer Room"], gradient: "from-emerald-400 to-teal-600" },
  { id: "aquafit", name: "AquaFit Center", category: "Swimming", location: "Al Wurud, Riyadh", rating: 4.6, reviews: 142, members: 190,
    description: "Olympic lane pool with coached swim sessions and aqua fitness classes.",
    amenities: ["Showers", "Lockers", "Parking", "Changing Rooms"], gradient: "from-sky-400 to-blue-700" },
  { id: "padel", name: "Padel Pro Arena", category: "Padel", location: "Al Muhammadiyah, Riyadh", rating: 4.7, reviews: 298, members: 440,
    description: "Premium glass-walled padel courts, beginner to pro level coaching.",
    amenities: ["Showers", "Café", "Parking", "Pro Shop"], gradient: "from-lime-400 to-emerald-600" },
  { id: "flex", name: "FlexFusion Fitness", category: "CrossFit/HIIT", location: "Al Aqiq, Riyadh", rating: 4.4, reviews: 256, members: 360,
    description: "High-intensity functional fitness — CrossFit, HIIT, boxing and conditioning.",
    amenities: ["Showers", "Lockers", "Parking"], gradient: "from-orange-500 to-rose-600" },
  { id: "mindbody", name: "Mind & Body Wellness", category: "Meditation", location: "Al Sulaimaniyah, Riyadh", rating: 4.9, reviews: 98, members: 150,
    description: "Mindfulness, meditation and breathwork in a tranquil environment.",
    amenities: ["Wi-Fi", "Prayer Room", "Café"], gradient: "from-indigo-400 to-purple-700" },
  { id: "squash", name: "Squash Republic", category: "Squash", location: "Al Rawdah, Riyadh", rating: 4.6, reviews: 167, members: 220,
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
    description: "High-energy indoor cycling studio with rhythm rides, live DJ sessions and performance tracking.",
    amenities: ["Showers", "Lockers", "Wi-Fi", "Café"], submittedAt: "2025-06-29" },
  { id: "momentum", name: "Momentum CrossFit", email: "team@momentumcf.sa", phone: "+966 53 447 6690", owner: "Yousef Al-Ghamdi",
    category: "CrossFit/HIIT", location: "Al Aqiq, Riyadh",
    description: "CrossFit box with certified L2 coaches, daily WODs, olympic lifting and mobility programming.",
    amenities: ["Showers", "Lockers", "Parking"], submittedAt: "2025-06-30" },
  { id: "serenity", name: "Serenity Spa & Yoga", email: "hello@serenity.sa", phone: "+966 56 220 3388", owner: "Huda Al-Rashid",
    category: "Yoga", location: "Al Rakah, Al Khobar",
    description: "Calm boutique studio offering Hatha, Yin and restorative yoga plus guided meditation.",
    amenities: ["Showers", "Wi-Fi", "Prayer Room", "Café"], submittedAt: "2025-07-01" },
];

export type Plan = { id: string; name: string; credits: number; price: number; popular?: boolean };
export const PLANS: Plan[] = [
  { id: "starter", name: "Starter Pack", credits: 50, price: 149 },
  { id: "active", name: "Active Pack", credits: 100, price: 249, popular: true },
  { id: "elite", name: "Elite Pack", credits: 150, price: 349 },
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

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Waitlisted" | "Rejected" | "No-Show";

export type Booking = {
  ref: string;
  customer: string;
  classId: string;
  status: BookingStatus;
  type: "Credit" | "Independent";
  credits?: number;
  amount?: number;
  createdAt: string;
};

export const BOOKINGS: Booking[] = [
  { ref: "WP-2025-04821", customer: "Sara Al-Hamdan", classId: "c2", status: "Confirmed", type: "Credit", credits: 15, createdAt: "2025-06-28 09:12" },
  { ref: "WP-2025-04820", customer: "Ahmed Al-Rashidi", classId: "c6", status: "Pending", type: "Credit", credits: 12, createdAt: "2025-06-28 08:42" },
  { ref: "WP-2025-04819", customer: "Fatima Al-Dosari", classId: "c1", status: "Confirmed", type: "Credit", credits: 12, createdAt: "2025-06-28 08:10" },
  { ref: "WP-2025-04818", customer: "Khalid Al-Shehri", classId: "c9", status: "Pending", type: "Independent", amount: 80, createdAt: "2025-06-28 07:55" },
  { ref: "WP-2025-04817", customer: "Noura Al-Otaibi", classId: "c5", status: "Confirmed", type: "Credit", credits: 8, createdAt: "2025-06-27 22:30" },
  { ref: "WP-2025-04816", customer: "Sara Al-Hamdan", classId: "c5", status: "Completed", type: "Credit", credits: 8, createdAt: "2025-06-26 17:00" },
  { ref: "WP-2025-04815", customer: "Ahmed Al-Rashidi", classId: "c3", status: "Completed", type: "Credit", credits: 10, createdAt: "2025-06-26 18:00" },
  { ref: "WP-2025-04814", customer: "Fatima Al-Dosari", classId: "c7", status: "Cancelled", type: "Credit", credits: 6, createdAt: "2025-06-25 08:00" },
  { ref: "WP-2025-04813", customer: "Khalid Al-Shehri", classId: "c4", status: "Rejected", type: "Independent", amount: 100, createdAt: "2025-06-25 11:20" },
  { ref: "WP-2025-04812", customer: "Sara Al-Hamdan", classId: "c3", status: "Waitlisted", type: "Credit", credits: 10, createdAt: "2025-06-28 06:00" },
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
  { name: "Sara Al-Hamdan", email: "sara@example.com", plan: "Active Pack", credits: 78, bookings: 12, points: 340, status: "Active" },
  { name: "Ahmed Al-Rashidi", email: "ahmed@example.com", plan: "Elite Pack", credits: 132, bookings: 28, points: 890, status: "Active" },
  { name: "Noura Al-Otaibi", email: "noura@example.com", plan: "Starter Pack", credits: 22, bookings: 5, points: 120, status: "Frozen" },
  { name: "Khalid Al-Shehri", email: "khalid@example.com", plan: "—", credits: 0, bookings: 3, points: 60, status: "Active" },
  { name: "Fatima Al-Dosari", email: "fatima@example.com", plan: "Active Pack", credits: 95, bookings: 9, points: 270, status: "Active" },
];

export function studioById(id: string) {
  return STUDIOS.find((s) => s.id === id);
}
export function classById(id: string) {
  return CLASSES.find((c) => c.id === id);
}

export const REVENUE_WEEKLY = [
  { week: "W1", revenue: 980 }, { week: "W2", revenue: 1220 }, { week: "W3", revenue: 1430 }, { week: "W4", revenue: 1190 },
];
// Monthly revenue by source: `credit` + `independent` are class-booking revenue,
// `membership` is revenue from membership package sales.
export const REVENUE_MONTHLY = [
  { month: "Jan", credit: 4200, independent: 1800, membership: 2400 }, { month: "Feb", credit: 4600, independent: 2100, membership: 2700 },
  { month: "Mar", credit: 5100, independent: 2400, membership: 3000 }, { month: "Apr", credit: 5800, independent: 2700, membership: 3400 },
  { month: "May", credit: 6300, independent: 3100, membership: 3800 }, { month: "Jun", credit: 7100, independent: 3500, membership: 4200 },
];

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
  { id: 2, type: "warning", title: "Waitlist Spot Available", body: "A spot opened in HIIT Blast at FlexFusion Fitness! You have 10 minutes to confirm.", time: "3h ago", unread: true },
  { id: 3, type: "error", title: "Booking Rejected", body: "Squash Republic has declined your booking for today 4:00 PM.", time: "5h ago", unread: false },
  { id: 4, type: "success", title: "Credits Refunded", body: "15 credits have been returned to your account. Booking: WP-2025-04760", time: "Yesterday", unread: false },
  { id: 5, type: "info", title: "Loyalty Points Earned", body: "You earned 10 points for attending Morning Flow Yoga! Total: 340 pts", time: "Yesterday", unread: false },
  { id: 6, type: "info", title: "Referral Reward", body: "Your friend Ahmed joined using your code! You earned 25 bonus points.", time: "2 days ago", unread: false },
  { id: 7, type: "default", title: "Membership Renewal Reminder", body: "Your Active Pack renews in 7 days on Jul 31. SAR 249 will be charged.", time: "3 days ago", unread: false },
];