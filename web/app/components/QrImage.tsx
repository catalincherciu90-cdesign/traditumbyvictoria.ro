"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrImage({ text, size = 220 }: { text: string; size?: number }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(text, { width: size, margin: 1, color: { dark: "#241d15", light: "#ffffff" } })
      .then((d) => { if (alive) setSrc(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, [text, size]);
  if (!src) return <div style={{ width: size, height: size }} className="animate-pulse rounded-lg bg-cream-2" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={size} height={size} alt="Cod QR" className="rounded-lg ring-1 ring-line" />;
}
