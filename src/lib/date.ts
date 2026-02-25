export function formatDate(iso: string, locale = "en-US") {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
