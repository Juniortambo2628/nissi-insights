/**
 * Helpers for handling pasted lists of email addresses.
 * Clients often copy emails out of spreadsheets/CSVs, so we accept
 * comma, semicolon, whitespace and newline separated values.
 */

const EMAIL_REGEX = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

/** Parse a free-form blob of text into a unique list of valid, lowercased emails. */
export function parseEmailList(text: string): string[] {
  if (!text) return []

  const seen = new Set<string>()

  for (const token of text.split(/[\s,;]+/)) {
    const email = token.trim().toLowerCase().replace(/^[<"'([{]+|[>'")\]},.;]+$/g, '')
    if (email && EMAIL_REGEX.test(email)) {
      seen.add(email)
    }
  }

  return Array.from(seen)
}

/** Count how many tokens in the blob were not valid emails. */
export function countInvalidEmailTokens(text: string): number {
  if (!text) return 0

  const tokens = text.split(/[\s,;]+/).filter((token) => token.trim() !== '')
  return tokens.length - parseEmailList(text).length
}
