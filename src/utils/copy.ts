import rfdc from "rfdc";

export function copy<T>(input: T): T {
  const cl = rfdc();
  return cl(input);
}
