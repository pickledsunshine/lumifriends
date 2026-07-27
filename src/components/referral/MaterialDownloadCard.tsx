"use client";

import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { partner, type VenueMaterial } from "@/lib/mock-data";

/**
 * Preview stands in for the final artwork. It is composed rather than an image
 * so the placeholder never looks like a broken asset.
 */
function MaterialPreview({ material }: { material: VenueMaterial }) {
  const isYellow = material.accent === "yellow";

  return (
    <div
      aria-hidden
      className={`flex flex-col items-center justify-center gap-2 rounded-control border border-line ${
        isYellow ? "bg-surface-yellow" : "bg-surface-purple"
      }`}
      style={{ aspectRatio: material.aspect }}
    >
      <span className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className={`size-2.5 rounded-[3px] ${
              [0, 2, 4, 6, 8].includes(index)
                ? isYellow
                  ? "bg-accent-strong"
                  : "bg-brand"
                : "bg-white"
            }`}
          />
        ))}
      </span>
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${
          isYellow ? "text-accent-strong" : "text-brand"
        }`}
      >
        Placeholder
      </span>
    </div>
  );
}

export function MaterialDownloadCard({ material }: { material: VenueMaterial }) {
  const { showToast } = useToast();

  return (
    <Card className="flex flex-col gap-4 p-5">
      <MaterialPreview material={material} />

      <div className="flex-1">
        <h3 className="text-sm font-bold text-heading">{material.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{material.recommendedUse}</p>
      </div>

      <Button
        variant="outline"
        // A real file is served from /public, so the download is not a dead action.
        onClick={() => {
          const link = document.createElement("a");
          link.href = material.assetPath;
          link.download = material.fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          showToast(`${material.name} placeholder downloaded`);
        }}
      >
        <Download aria-hidden className="size-4" />
        Download
        <span className="sr-only"> {material.name} for {partner.displayName}</span>
      </Button>
    </Card>
  );
}
