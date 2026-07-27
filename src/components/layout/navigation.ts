import type { ComponentType } from "react";
import { CircleQuestionMark, LayoutDashboard, Share2, UserRound, Wallet, Zap } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

/** Primary navigation — spec §4. */
export const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activations", label: "Activations", icon: Zap },
  { href: "/payouts", label: "Payouts", icon: Wallet },
  { href: "/referral-tools", label: "Referral tools", icon: Share2 },
  { href: "/account", label: "Account", icon: UserRound },
];

export const secondaryNav: NavItem[] = [
  { href: "/account#support", label: "Help and support", icon: CircleQuestionMark },
];
