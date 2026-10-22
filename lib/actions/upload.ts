"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image to Supabase Storage bucket 'public-media'.
 * Handles binary conversion, safe file naming, and returns the direct public URL.
 */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file || !(file instanceof File) || file.size === 0) {
      return { ok: false, error: "কোনো ইমেজ ফাইল নির্বাচন করা হয়নি।" };
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: "ইমেজের সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারে।" };
    }

    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedMimes.includes(file.type)) {
      return {
        ok: false,
        error: "শুধুমাত্র JPG, PNG, WEBP, GIF বা SVG ফাইল আপলোড করা যাবে।",
      };
    }

    const supabase = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 32);
    const storagePath = `${folder}/${Date.now()}_${cleanBase}.${ext}`;

    const { data, error } = await supabase.storage
      .from("public-media")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return { ok: false, error: error.message };
    }

    const { data: publicData } = supabase.storage
      .from("public-media")
      .getPublicUrl(data.path);

    return {
      ok: true,
      url: publicData.publicUrl,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ইমেজ আপলোড ব্যর্থ হয়েছে।";
    console.error("uploadImageAction error:", err);
    return { ok: false, error: message };
  }
}
