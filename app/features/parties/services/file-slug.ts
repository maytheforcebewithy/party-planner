/** A filesystem-safe slug from a party name, or `party` when it reduces to nothing. */
export function fileSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'party'
}
