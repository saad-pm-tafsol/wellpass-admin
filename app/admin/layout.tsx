"use client";

import { usePathname } from "next/navigation";
import { SidebarLayout } from "@/components/wp/SidebarLayout";
import { LayoutDashboard, Building2, Users, ClipboardList, Coins, ArrowLeftRight, Tags, Gift, Wallet, TrendingUp, Banknote, Percent, ScrollText, HelpCircle, Bell, Settings as SettingsIcon, Undo2 } from "lucide-react";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/studios", label: "Partners", icon: Building2 },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/admin/refunds", label: "Refunds", icon: Undo2 },
  { to: "/admin/membership-plans", label: "Membership Plans", icon: Coins },
  { to: "/admin/credit-rate", label: "Credit Rate", icon: ArrowLeftRight },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/loyalty", label: "Loyalty", icon: Gift },
  { to: "/admin/revenue", label: "Revenue", icon: Wallet },
  { to: "/admin/profits", label: "Profits", icon: TrendingUp },
  { to: "/admin/payouts", label: "Payouts", icon: Banknote },
  { to: "/admin/commission", label: "Commission", icon: Percent },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/terms", label: "Terms & Policies", icon: ScrollText },
];

const titles: Record<string, string> = {
  "/admin/dashboard": "Admin Dashboard",
  "/admin/studios": "Partner Management",
  "/admin/customers": "Customer Management",
  "/admin/bookings": "Booking Administration",
  "/admin/refunds": "Refunds",
  "/admin/membership-plans": "Membership Plans",
  "/admin/credit-rate": "Credit Conversion",
  "/admin/categories": "Categories",
  "/admin/loyalty": "Loyalty & Referral",
  "/admin/revenue": "Revenue",
  "/admin/profits": "Profits",
  "/admin/payouts": "Partner Payouts",
  "/admin/commission": "Commission",
  "/admin/settings": "Platform Settings",
  "/admin/notifications": "Notifications",
  "/admin/faqs": "FAQs",
  "/admin/terms": "Terms & Policies",
};

function titleFor(path: string): string {
  if (titles[path]) return titles[path];
  const match = Object.keys(titles).find((key) => path.startsWith(key + "/"));
  return match ? titles[match] : "WellPass Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <SidebarLayout nav={nav} title={titleFor(path)} subtitle="Super admin" variant="admin">
      {children}
    </SidebarLayout>
  );
}
