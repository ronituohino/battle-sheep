/**
 * @param max Max value (excluded)
 * @returns Random integer between [0-max)
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
