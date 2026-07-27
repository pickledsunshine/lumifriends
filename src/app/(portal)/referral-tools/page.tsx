"use client";

import { useRef, useState } from "react";
import {
  Copy,
  Download,
  ExternalLink,
  Lightbulb,
  Mail,
  MessageCircle,
  Printer,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterSelect } from "@/components/ui/Fields";
import { QrCode, useQrCode } from "@/components/referral/QrCode";
import { MaterialDownloadCard } from "@/components/referral/MaterialDownloadCard";
import { useToast } from "@/components/ui/Toast";
import { copyToClipboard } from "@/lib/download";
import { partner, socialCaption, venueMaterials } from "@/lib/mock-data";

type QrFormat = "png" | "pdf";

export default function ReferralToolsPage() {
  const { showToast } = useToast();
  const { downloadPng, hiddenCanvas } = useQrCode(partner.referralLink);
  const [format, setFormat] = useState<QrFormat>("png");
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  async function copy(value: string, message: string) {
    const copied = await copyToClipboard(value);
    showToast(copied ? message : "Copy is unavailable in this browser", copied ? "success" : "info");
  }

  /** Opens a print-ready A5 sheet in a new window; the browser handles PDF export. */
  function openPrintableVersion() {
    const svg = qrWrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const markup = new XMLSerializer().serializeToString(svg);

    const printWindow = window.open("", "_blank", "width=820,height=1000");
    if (!printWindow) {
      showToast("Allow pop-ups to open the printable version.", "info");
      return;
    }

    printWindow.document.write(`<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Lumifriends — ${partner.referralCode}</title>
<style>
  @page { size: A5; margin: 14mm; }
  body { font-family: Quicksand, system-ui, sans-serif; color: #211a35; text-align: center;
         display: flex; flex-direction: column; align-items: center; justify-content: center;
         min-height: 90vh; margin: 0; }
  h1 { font-size: 26px; margin: 0 0 6px; }
  p  { color: #4e475d; margin: 0; font-size: 14px; }
  .qr { border: 1px solid #e6e1ef; border-radius: 16px; padding: 18px; margin: 24px 0; }
  .code { font-size: 30px; font-weight: 700; letter-spacing: .12em; color: #3d11c3; }
  .brand { margin-top: 26px; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: #766f86; }
</style></head>
<body>
  <h1>Pay like a local with Lumifin</h1>
  <p>Scan to join with ${partner.displayName}</p>
  <div class="qr">${markup}</div>
  <p class="code">${partner.referralCode}</p>
  <p>${partner.referralLink}</p>
  <p class="brand">Lumifriends by Lumifin</p>
</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function handleDownloadQr() {
    if (format === "pdf") {
      // Honest prototype action: the print sheet is the PDF path.
      openPrintableVersion();
      showToast("Opening the print sheet — choose “Save as PDF”.", "info");
      return;
    }
    const started = downloadPng(`lumifriends-qr-${partner.referralCode.toLowerCase()}.png`);
    showToast(started ? "QR code downloaded as PNG" : "QR download is unavailable", started ? "success" : "info");
  }

  const shareText = `${socialCaption} ${partner.referralLink}`;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Referral tools" }]}
        title="Referral tools"
        description="Share your unique code and help guests access Lumifin."
      />

      {hiddenCanvas}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR card */}
        <Card className="flex flex-col items-center gap-5 p-6 text-center sm:p-8">
          <div>
            <h2 className="text-lg font-bold">Your referral QR code</h2>
            <p className="mt-1 text-sm text-muted">Scan to join the Lumifriends programme.</p>
          </div>

          <div ref={qrWrapperRef}>
            <QrCode
              value={partner.referralLink}
              size={224}
              title={`QR code linking to ${partner.referralLink}`}
              className="border border-line shadow-card"
            />
          </div>

          <div>
            <p className="text-3xl font-bold tracking-[0.14em] text-brand">
              {partner.referralCode}
            </p>
            <p className="mt-1 text-sm text-muted">{partner.displayName}</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <FilterSelect
              label="Download format"
              value={format}
              options={[
                { value: "png", label: "PNG (high resolution)" },
                { value: "pdf", label: "PDF (print sheet)" },
              ]}
              onChange={setFormat}
              hideLabel
              className="flex-1"
            />
            <Button onClick={handleDownloadQr} className="sm:w-40">
              <Download aria-hidden className="size-4" />
              Download QR
            </Button>
          </div>

          <Button variant="outline" onClick={openPrintableVersion} className="w-full">
            <Printer aria-hidden className="size-4" />
            Open printable version
          </Button>

          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Lumifriends by Lumifin
          </p>
        </Card>

        {/* Sharing tools */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Share your code" description="Copy and send your code or link." />
            <div className="flex flex-col gap-5 p-6">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-heading">Referral code</p>
                <div className="flex items-center gap-2">
                  <p className="min-h-12 flex-1 rounded-control border border-line bg-page px-3.5 py-3 text-sm font-bold tracking-widest text-brand">
                    {partner.referralCode}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => copy(partner.referralCode, "Referral code copied")}
                    className="min-h-12"
                  >
                    <Copy aria-hidden className="size-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-semibold text-heading">Referral link</p>
                <div className="flex items-center gap-2">
                  <p className="min-h-12 flex-1 overflow-x-auto whitespace-nowrap rounded-control border border-line bg-page px-3.5 py-3 text-sm font-medium text-body">
                    {partner.referralLink}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => copy(partner.referralLink, "Referral link copied")}
                    className="min-h-12"
                  >
                    <Copy aria-hidden className="size-4" />
                    <span className="sr-only">Copy referral link</span>
                  </Button>
                  <a
                    href={partner.referralLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-12 items-center justify-center rounded-control border border-line px-3.5 text-brand transition-colors hover:bg-page"
                  >
                    <ExternalLink aria-hidden className="size-4" />
                    <span className="sr-only">Open referral link in a new tab</span>
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-success-soft px-3 text-sm font-bold text-success transition-opacity hover:opacity-85"
                >
                  <MessageCircle aria-hidden className="size-4" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    "Join Lumifin with our code",
                  )}&body=${encodeURIComponent(shareText)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-surface-purple px-3 text-sm font-bold text-brand transition-opacity hover:opacity-85"
                >
                  <Mail aria-hidden className="size-4" />
                  Email
                </a>
                <Button variant="outline" onClick={() => copy(socialCaption, "Caption copied")}>
                  <Copy aria-hidden className="size-4" />
                  Copy caption
                </Button>
              </div>

              <p className="rounded-control bg-page p-4 text-sm leading-relaxed text-body">
                {socialCaption}
              </p>
            </div>
          </Card>

          <Card tone="yellow" className="flex items-start gap-3 p-5">
            <Lightbulb aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-strong" />
            <p className="text-sm font-medium leading-relaxed text-heading">
              Place the QR code somewhere visible, such as your reception desk, cashier area,
              welcome message, or social-media bio.
            </p>
          </Card>
        </div>
      </div>

      {/* Venue materials */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Venue materials</h2>
        <p className="mt-1 text-body">
          Download ready-made assets for your space. Final artwork will replace these placeholders.
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {venueMaterials.map((material) => (
            <MaterialDownloadCard key={material.id} material={material} />
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-muted">
        Referral codes are issued by Lumifin. Partners cannot change their code or create
        additional codes.
      </p>
    </>
  );
}
