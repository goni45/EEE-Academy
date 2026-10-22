"use client";

import { uploadImageAction } from "@/lib/actions/upload";
import { Check, Image as ImageIcon, Link as LinkIcon, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export interface ImagePreset {
  label: string;
  url: string;
}

interface ImageUploadFieldProps {
  label: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder?: "courses" | "teachers" | "general";
  presets?: ImagePreset[];
  aspectRatio?: "landscape" | "portrait" | "square";
  hint?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = "general",
  presets = [],
  aspectRatio = "landscape",
  hint,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value || "");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await uploadImageAction(formData);
      if (res.ok && res.url) {
        onChange(res.url);
        setUrlInput(res.url);
      } else {
        setError(res.error || "আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ইমেজ আপলোড করতে সমস্যা হয়েছে।";
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleUrlApply() {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange(trimmed);
      setError(null);
    } else {
      onChange(null);
    }
  }

  const aspectClass =
    aspectRatio === "portrait"
      ? "aspect-[3/4] max-w-[180px]"
      : aspectRatio === "square"
      ? "aspect-square max-w-[160px]"
      : "aspect-[16/9] max-w-[280px]";

  return (
    <div className="space-y-3 rounded-2xl border border-stroke bg-surface/30 p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-primary flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[#89AACC]" />
          {label}
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setUrlInput("");
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
          >
            <Trash2 className="h-3 w-3" />
            মুছে ফেলুন
          </button>
        ) : null}
      </div>

      {hint ? <p className="text-[11px] text-muted">{hint}</p> : null}

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview Container */}
        <div
          className={`relative w-full ${aspectClass} shrink-0 overflow-hidden rounded-xl border border-stroke bg-bg/80 flex items-center justify-center group`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Selected"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded-full">
                  Preview
                </span>
              </div>
            </>
          ) : (
            <div className="text-center p-3 text-muted">
              <ImageIcon className="h-7 w-7 mx-auto opacity-40 mb-1" />
              <span className="text-[11px] block">কোনো ইমেজ নেই</span>
            </div>
          )}

          {isUploading ? (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 z-10">
              <Loader2 className="h-6 w-6 text-[#89AACC] animate-spin" />
              <span className="text-[11px] text-[#f5f5f5] font-mono">আপলোড হচ্ছে...</span>
            </div>
          ) : null}
        </div>

        {/* Action Controls */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-text-primary px-3.5 py-1.5 text-xs font-medium text-bg hover:bg-white transition cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              {isUploading ? "আপলোড হচ্ছে..." : "ডিভাইস থেকে আপলোড"}
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stroke bg-bg px-3 py-1.5 text-xs text-text-primary hover:border-[#89AACC] transition cursor-pointer"
            >
              <LinkIcon className="h-3 w-3 text-[#89AACC]" />
              {showUrlInput ? "URL লুকান" : "ইমেজ লিংক দিন"}
            </button>
          </div>

          {/* Direct URL input accordion */}
          {showUrlInput ? (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlApply();
                  }
                }}
                className="flex-1 rounded-xl border border-stroke bg-bg px-3 py-1.5 text-xs focus:border-[#89AACC] focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleUrlApply}
                className="rounded-xl border border-[#89AACC]/40 bg-[#89AACC]/10 px-3 py-1.5 text-xs text-[#89AACC] hover:bg-[#89AACC]/20 transition cursor-pointer"
              >
                Apply
              </button>
            </div>
          ) : null}

          {/* Quick Presets */}
          {presets.length > 0 ? (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-muted uppercase tracking-wider flex items-center gap-1 font-mono">
                <Sparkles className="h-2.5 w-2.5 text-[#89AACC]" />
                অথবা প্রিসেট থেকে বেছে নিন:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset) => {
                  const isSelected = value === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        onChange(preset.url);
                        setUrlInput(preset.url);
                        setError(null);
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] rounded-lg px-2.5 py-1 border transition cursor-pointer ${
                        isSelected
                          ? "border-[#89AACC] bg-[#89AACC]/15 text-white"
                          : "border-stroke/60 bg-bg/60 text-muted hover:text-text-primary hover:border-stroke"
                      }`}
                    >
                      {isSelected ? <Check className="h-2.5 w-2.5 text-[#89AACC]" /> : null}
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Error notice */}
          {error ? (
            <p className="text-[11px] text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded-lg px-2.5 py-1">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
