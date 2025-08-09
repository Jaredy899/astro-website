export function cleanSlug(originalSlug: string): string {
  const parts = originalSlug.split('/');
  const lastSegment = parts[parts.length - 1] || originalSlug;

  // Remove leading date (YYYY-MM-DD-) or numeric prefixes (e.g., 12-)
  const withoutPrefixes = lastSegment
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/^\d+-/, '');

  // Basic slugify: lowercase, replace non-alphanumerics with '-', collapse, and trim '-'
  const simplified = withoutPrefixes
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

  return simplified;
}

export function cleanPathSlug(originalSlug: string): string {
  // Preserve directory, clean the last segment only
  const parts = originalSlug.split('/');
  const dir = parts.slice(0, -1).join('/');
  const cleaned = cleanSlug(originalSlug);
  return cleaned;
}


