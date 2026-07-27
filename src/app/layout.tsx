import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumifriends Partner Portal",
  description:
    "Track referral activations, accrued partner earnings and upcoming payouts for your Lumifin partnership.",
};

export const viewport: Viewport = {
  themeColor: "#3d11c3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
