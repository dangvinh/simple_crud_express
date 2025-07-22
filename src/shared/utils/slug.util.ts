// Convert a string to a URL-friendly slug
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/(^-+)|(-+$)/g, ""); // trim hyphens from start and end
}
