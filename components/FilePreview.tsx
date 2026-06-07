"use client";
import { useEffect, useState } from "react";
import { getFileKind } from "@/lib/file-preview";

interface Props {
  /** Backend URL that serves the file inline (attachment download / material preview). */
  url: string;
  fileName: string;
}

/**
 * Renders a file preview for every supported type. The file is fetched as a blob
 * and previewed from a same-origin object URL — this avoids Chrome blocking its
 * built-in PDF viewer on cross-origin iframes, and lets the Download link's
 * `download` attribute work. PDFs render in an iframe, images in an <img>, and
 * Office files (docx/pptx, which browsers can't render inline) show a card with
 * Open + Download actions.
 */
export default function FilePreview({ url, fileName }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;
    setLoading(true);
    setError(false);
    setBlobUrl(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[rgba(232,228,240,0.45)] text-sm">
        Loading…
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="flex items-center justify-center h-full text-[#f87171] text-sm">
        Failed to load file.
      </div>
    );
  }

  const kind = getFileKind(fileName);

  if (kind === "pdf") {
    return <iframe src={blobUrl} className="w-full h-full bg-white" title={fileName} />;
  }

  if (kind === "image") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0910] p-4 overflow-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={blobUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
      </div>
    );
  }

  // office / other — no reliable in-browser renderer, so offer open + download.
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center text-white/60">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <p className="text-sm max-w-xs break-words" title={fileName}>{fileName}</p>
      <p className="text-xs text-white/35">This file type can&apos;t be previewed in the browser.</p>
      <a
        href={blobUrl}
        download={fileName}
        className="px-4 py-2 rounded-full text-sm bg-[#7c6af7] text-white hover:bg-[#8b7bf8] transition-colors inline-flex items-center gap-2"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </a>
    </div>
  );
}
