"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="bn">
      <body className="bg-[#0a0a0a] text-white flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">একটি সমস্যা দেখা দিয়েছে</h2>
          <p className="text-sm text-neutral-400">দয়া করে পেজটি আবার রিলোড করুন।</p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </body>
    </html>
  );
}
