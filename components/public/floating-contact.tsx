"use client";

import { getPublicSettings } from "@/lib/data";
import type { SiteSettings } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FloatingContact() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(() => getPublicSettings());

  useEffect(() => {
    // Listen for live updates when changed in Admin Panel
    const handleUpdate = () => {
      setSettings(getPublicSettings());
    };

    window.addEventListener("eee_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("eee_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // WhatsApp link generator
  const rawWhatsApp = settings.whatsapp_number || "+8801700000000";
  const cleanWhatsApp = rawWhatsApp.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    "Hello EEE Academy, I want to inquire about your courses.",
  )}`;

  // Messenger link generator
  const messengerUrl =
    settings.messenger_url ||
    (settings.facebook_page_url
      ? settings.facebook_page_url.replace("facebook.com", "m.me")
      : "https://m.me/eeeacademy");

  // Call phone link
  const rawHelpline = settings.helpline_number || "+8801700000000";
  const cleanPhone = rawHelpline.replace(/[^\d+]/g, "");
  const callUrl = `tel:${cleanPhone}`;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <aside aria-label="Floating Contact Menu" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded 3 Action Buttons */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 flex flex-col gap-2.5 items-end pointer-events-auto"
          >
            {/* 1. WhatsApp Button */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="group flex items-center gap-3 rounded-full bg-[#141414]/95 border border-[#1f1f1f] hover:border-[#25D366]/50 pl-4 pr-2.5 py-2 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium text-[#f5f5f5] group-hover:text-emerald-400 transition-colors">
                  WhatsApp
                </span>
                <span className="text-[10px] text-[#878787] font-mono">
                  {rawWhatsApp}
                </span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-black transition-all duration-300">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
            </motion.a>

            {/* 2. Messenger Button */}
            <motion.a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="group flex items-center gap-3 rounded-full bg-[#141414]/95 border border-[#1f1f1f] hover:border-[#0084FF]/50 pl-4 pr-2.5 py-2 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium text-[#f5f5f5] group-hover:text-blue-400 transition-colors">
                  Messenger
                </span>
                <span className="text-[10px] text-[#878787]">
                  মেসেঞ্জারে চ্যাট করুন
                </span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0084FF]/15 text-[#0084FF] group-hover:bg-[#0084FF] group-hover:text-white transition-all duration-300">
                <Send className="w-4 h-4" />
              </div>
            </motion.a>

            {/* 3. Call Helpline Button */}
            <motion.a
              href={callUrl}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="group flex items-center gap-3 rounded-full bg-[#141414]/95 border border-[#1f1f1f] hover:border-[#4E85BF]/50 pl-4 pr-2.5 py-2 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium text-[#f5f5f5] group-hover:text-[#89AACC] transition-colors">
                  Direct Call
                </span>
                <span className="text-[10px] text-[#878787] font-mono">
                  {rawHelpline}
                </span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4E85BF]/15 text-[#89AACC] group-hover:bg-[#4E85BF] group-hover:text-white transition-all duration-300">
                <Phone className="w-4 h-4" />
              </div>
            </motion.a>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
        className="group relative flex items-center gap-2.5 rounded-full p-1 transition-all duration-300 hover:scale-105 cursor-pointer shadow-2xl"
      >
        {/* Animated Accent Border */}
        <span className="absolute inset-0 rounded-full accent-gradient-border opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Inner Button Content */}
        <span className="relative z-10 flex items-center gap-2.5 rounded-full bg-[#141414] px-4 py-3 text-sm font-medium text-[#f5f5f5] border border-white/10 backdrop-blur-md">
          {/* Green Online Pulse Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <span className="hidden sm:inline font-sans text-xs tracking-wide">
            {open ? "বন্ধ করুন" : "মেসেজ পাঠান"}
          </span>

          <span className="flex items-center justify-center transition-transform duration-300">
            {open ? (
              <X className="w-4 h-4 text-[#878787] group-hover:text-white" />
            ) : (
              <MessageCircle className="w-4 h-4 text-[#89AACC] group-hover:scale-110 transition-transform" />
            )}
          </span>
        </span>
      </button>
    </aside>
  );
}
