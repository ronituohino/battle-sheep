import rfdc from "rfdc";

/**
 * Copies any JS object.
 *
 * @param input Any input element
 * @returns A copy of the given input with different reference
 */
export function copy<T>(input: T): T {
  const cl = rfdc();
  return cl(input);
}
