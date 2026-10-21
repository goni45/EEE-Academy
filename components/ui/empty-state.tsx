export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-stroke bg-surface px-6 py-16 text-center">
      <p className="font-display italic text-2xl text-text-primary">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}

export function ErrorState({
  title = "Unable to load this section",
  description = "Try again in a moment. Sample data is used in this preview.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border border-stroke bg-surface px-6 py-12 text-center">
      <p className="text-text-primary">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
