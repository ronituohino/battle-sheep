/**
 * Regex to match numbers
 *
 * @param value string input
 * @returns if given string is like a number
 */
export function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}
