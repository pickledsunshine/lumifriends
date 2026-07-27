"use client";

import { useState } from "react";
import { Copy, Download, QrCode as QrCodeIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { QrCode, useQrCode } from "@/components/referral/QrCode";
import { useToast } from "@/components/ui/Toast";
import { copyToClipboard } from "@/lib/download";
import { partner } from "@/lib/mock-data";

/** Dashboard referral card — soft-purple surface, spec §7.3. */
export function ReferralCodeCard() {
  const { showToast } = useToast();
  const { downloadPng, hiddenCanvas } = useQrCode(partner.referralLink);
  const [qrOpen, setQrOpen] = useState(false);

  async function handleCopy() {
    const copied = await copyToClipboard(partner.referralCode);
    showToast(copied ? "Referral code copied" : "Copy is unavailable in this browser", copied ? "success" : "info");
  }

  function handleDownload() {
    const started = downloadPng(`lumifriends-qr-${partner.referralCode.toLowerCase()}.png`);
    showToast(started ? "QR code downloaded as PNG" : "QR download is unavailable", started ? "success" : "info");
  }

  return (
    <Card tone="purple" className="relative flex flex-col gap-5 p-6">
      {hiddenCanvas}

      <div>
        <h2 className="text-lg font-bold text-brand">Your referral code</h2>
        <p className="mt-1 text-sm text-body">
          Use this code or QR on your signage and referral links.
        </p>
      </div>

      <div className="rounded-control border-2 border-dashed border-[#c9b8ff] bg-white/70 px-4 py-3.5 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">Referral code</p>
        <p className="mt-1 text-2xl font-bold tracking-[0.12em] text-brand">
          {partner.referralCode}
        </p>
      </div>

      <div className="flex justify-center">
        <QrCode
          value={partner.referralLink}
          size={148}
          title={`QR code linking to ${partner.referralLink}`}
          className="border border-line shadow-card"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={handleCopy} className="w-full">
          <Copy aria-hidden className="size-4" />
          Copy code
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setQrOpen(true)}>
            <QrCodeIcon aria-hidden className="size-4" />
            View QR
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download aria-hidden className="size-4" />
            Download
          </Button>
        </div>
      </div>

      <Modal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Your referral QR code"
        description={`Guests who scan this join Lumifin with code ${partner.referralCode}.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setQrOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownload}>
              <Download aria-hidden className="size-4" />
              Download PNG
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <QrCode
            value={partner.referralLink}
            size={220}
            title={`QR code linking to ${partner.referralLink}`}
            className="border border-line"
          />
          <p className="text-lg font-bold tracking-[0.12em] text-brand">{partner.referralCode}</p>
          <p className="text-sm text-muted">{partner.displayName}</p>
        </div>
      </Modal>
    </Card>
  );
}
