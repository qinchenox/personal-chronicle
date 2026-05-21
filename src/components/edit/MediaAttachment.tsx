"use client";

import { useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";

interface Props {
  media: MediaItem[];
  onAdd: (item: { type: "image" | "video"; url: string; caption?: string }) => void;
  onRemove: (mediaId: string) => void;
}

export function MediaAttachment({ media, onAdd, onRemove }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      const isVideo = file.type.startsWith("video/");
      onAdd({ type: isVideo ? "video" : "image", url, caption: file.name });
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="mt-3 pt-3 border-t border-neutral-100">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-accent transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          添加图片/视频
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
        {media.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {expanded ? "收起" : `${media.length} 个附件`}
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {media.map((m) => (
            <div key={m.id} className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 aspect-square">
              {m.type === "image" ? (
                <img src={m.url} alt={m.caption || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white text-2xl">▶</div>
              )}
              <button
                type="button"
                onClick={() => onRemove(m.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
