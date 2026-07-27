"use client";

import { useCallback, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { downloadDataUrl } from "@/lib/download";

const BRAND_PURPLE = "#3d11c3";

/**
 * Renders a genuinely scannable QR for the referral link.
 * The visible code is SVG (crisp at any size); a hidden high-resolution canvas
 * backs the PNG download so the exported asset is print-quality.
 */
export function useQrCode(value: string) {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const downloadPng = useCallback(
    (fileName: string) => {
      const canvas = canvasWrapperRef.current?.querySelector("canvas");
      if (!canvas) return false;
      downloadDataUrl(canvas.toDataURL("image/png"), fileName);
      return true;
    },
    [],
  );

  const hiddenCanvas = (
    <div ref={canvasWrapperRef} aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
      <QRCodeCanvas value={value} size={1024} level="M" marginSize={4} fgColor={BRAND_PURPLE} />
    </div>
  );

  return { downloadPng, hiddenCanvas };
}

export function QrCode({
  value,
  size = 200,
  className = "",
  title,
}: {
  value: string;
  size?: number;
  className?: string;
  title: string;
}) {
  return (
    <span className={`inline-flex rounded-card bg-white p-3 ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        marginSize={1}
        fgColor={BRAND_PURPLE}
        bgColor="#ffffff"
        title={title}
      />
    </span>
  );
}
