"use client";

import { getPublicSettings, saveSettings } from "@/lib/data";
import { updateSiteSettingsAction } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(() => getPublicSettings());
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadDbSettings() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setSettings((curr) => ({ ...curr, ...data }));
        }
      } catch (err) {
        console.warn("Could not load settings from Supabase:", err);
      }
    }
    loadDbSettings();
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    saveSettings(settings);
    await updateSiteSettingsAction(settings);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl text-text-primary">Site settings</h1>
      <p className="mt-2 text-sm text-muted">
        Configure public contact channels, social profiles, and floating contact buttons.
      </p>

      {saved ? (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
          <span>✓ Settings saved successfully! Floating contact buttons are updated.</span>
          <button
            type="button"
            onClick={() => setSaved(false)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <form className="mt-8 space-y-8" onSubmit={handleSave}>
        {/* Floating Contact Buttons Section */}
        <fieldset className="space-y-4 rounded-3xl border border-stroke bg-surface/40 p-5">
          <legend className="text-sm font-medium uppercase tracking-[0.16em] text-[#89AACC] px-2">
            Floating Message Button Contacts (WhatsApp, Messenger, Call)
          </legend>
          <p className="text-xs text-muted mb-2 px-2">
            ওয়েবসাইটের নিচের ফ্লোটিং মেসেজ বাটনে ক্লিক করলে এই তথ্য অনুযায়ী WhatsApp, Messenger এবং Call অপশন খুলবে।
          </p>
          <Input
            label="WhatsApp Number (with country code)"
            value={settings.whatsapp_number ?? ""}
            onChange={(v) => update("whatsapp_number", v || null)}
            placeholder="+8801700000000"
          />
          <Input
            label="Facebook Messenger Link / Username"
            value={settings.messenger_url ?? ""}
            onChange={(v) => update("messenger_url", v || null)}
            placeholder="https://m.me/yourpage or page username"
          />
          <Input
            label="Helpline / Direct Call Phone Number"
            value={settings.helpline_number ?? ""}
            onChange={(v) => update("helpline_number", v || null)}
            placeholder="+8801700000000"
          />
        </fieldset>

        {/* Other Public Contact */}
        <fieldset className="space-y-3">
          <legend className="text-sm uppercase tracking-[0.16em] text-muted">Additional Information</legend>
          <Input
            label="Support email"
            value={settings.support_email ?? ""}
            onChange={(v) => update("support_email", v || null)}
            placeholder="support@eeeacademy.edu.bd"
          />
          <Input
            label="Address"
            value={settings.location_address ?? ""}
            onChange={(v) => update("location_address", v || null)}
            placeholder="Dhaka, Bangladesh"
          />
          <Input
            label="Public Facebook page URL"
            value={settings.facebook_page_url ?? ""}
            onChange={(v) => update("facebook_page_url", v || null)}
            placeholder="https://facebook.com/eeeacademy"
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm uppercase tracking-[0.16em] text-muted">Payment instructions</legend>
          <label className="block text-sm">
            bKash instructions
            <textarea
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-4 py-3"
              value={settings.bkash_instructions ?? ""}
              onChange={(e) => update("bkash_instructions", e.target.value || null)}
              placeholder="bKash payment guidelines"
            />
          </label>
          <label className="block text-sm">
            Nagad instructions
            <textarea
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-4 py-3"
              value={settings.nagad_instructions ?? ""}
              onChange={(e) => update("nagad_instructions", e.target.value || null)}
              placeholder="Nagad payment guidelines"
            />
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-text-primary px-6 py-2.5 text-sm font-medium text-bg hover:opacity-90 transition cursor-pointer disabled:opacity-50"
        >
          {saving ? "সংরক্ষণ করা হচ্ছে…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder = "Not configured",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-text-primary/90">{label}</span>
      <input
        className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2.5 text-sm text-text-primary focus:border-[#89AACC] outline-none transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
