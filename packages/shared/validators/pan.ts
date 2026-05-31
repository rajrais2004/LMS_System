export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function isValidPAN(value: string) {
  return PAN_REGEX.test(value);
}
