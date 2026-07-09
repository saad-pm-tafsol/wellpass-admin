// General platform alerts surfaced in the admin header bell. Static demo data —
// no backend. Shared so the bell and any "view all" surface stay consistent.

export type AdminAlert = {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  body: string;
  time: string;
  href: string;
};

export const ADMIN_ALERTS: AdminAlert[] = [
  { id: "al1", type: "warning", title: "Partner awaiting approval", body: "PowerLift Athletics submitted an application and is pending review.", time: "2h ago", href: "/admin/studios" },
  { id: "al2", type: "info", title: "7 quarterly payouts due", body: "SAR 28.6k across 7 partners is ready to be released.", time: "5h ago", href: "/admin/revenue" },
  { id: "al3", type: "error", title: "Booking dispute opened", body: "Khalid Al-Shehri disputed booking WP-2025-04813.", time: "Yesterday", href: "/admin/bookings" },
  { id: "al4", type: "success", title: "Revenue milestone reached", body: "The platform crossed SAR 84k in lifetime revenue.", time: "Yesterday", href: "/admin/revenue" },
  { id: "al5", type: "info", title: "Customer registrations up 18%", body: "64 new customers signed up on Saturday — a weekly high.", time: "2 days ago", href: "/admin/dashboard" },
  { id: "al6", type: "warning", title: "Membership renewals due", body: "23 Active Pack memberships renew in the next 7 days.", time: "3 days ago", href: "/admin/customers" },
];
