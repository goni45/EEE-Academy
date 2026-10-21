"use client";

import { getPublicSettings } from "@/lib/data";
import type { SiteSettings } from "@/lib/types";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(() => getPublicSettings());
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl text-text-primary">Site settings</h1>
      <p className="mt-2 text-sm text-muted">
        Leave fields empty rather than inventing numbers. Saving is local only.
      </p>
      <form
        className="mt-8 space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <fieldset className="space-y-3">
          <legend className="text-sm uppercase tracking-[0.16em] text-muted">Public contact</legend>
          <Input label="WhatsApp number" value={settings.whatsapp_number ?? ""} onChange={(v) => update("whatsapp_number", v || null)} />
          <Input label="Helpline" value={settings.helpline_number ?? ""} onChange={(v) => update("helpline_number", v || null)} />
          <Input label="Support email" value={settings.support_email ?? ""} onChange={(v) => update("support_email", v || null)} />
          <Input label="Address" value={settings.location_address ?? ""} onChange={(v) => update("location_address", v || null)} />
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="text-sm uppercase tracking-[0.16em] text-muted">Social</legend>
          <Input label="Public Facebook page" value={settings.facebook_page_url ?? ""} onChange={(v) => update("facebook_page_url", v || null)} />
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="text-sm uppercase tracking-[0.16em] text-muted">Payment instructions</legend>
          <label className="block text-sm">
            bKash
            <textarea
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-4 py-3"
              value={settings.bkash_instructions ?? ""}
              onChange={(e) => update("bkash_instructions", e.target.value || null)}
            />
          </label>
          <label className="block text-sm">
            Nagad
            <textarea
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-4 py-3"
              value={settings.nagad_instructions ?? ""}
              onChange={(e) => update("nagad_instructions", e.target.value || null)}
            />
          </label>
        </fieldset>
        <p className="text-xs text-muted">Private Facebook group URLs are not part of this public settings screen.</p>
        <button type="submit" className="rounded-full bg-text-primary px-5 py-2 text-sm text-bg">
          Save locally
        </button>
        {saved ? (
          <p className="text-sm text-muted" role="status">
            Stored in this browser session only. Not saved to a server.
          </p>
        ) : null}
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Not configured"
      />
    </label>
  );
}
