// Platform-wide credit economics. Static demo defaults; admin edits are held
// in the client store for the current admin session.

/** Credit quantity used by the default conversion rate. */
export const CREDIT_AMOUNT = 1;

/** SAR value of the default credit quantity. 1 credit = SAR 2.00 by default. */
export const CREDIT_VALUE_SAR = 2;

/** Platform commission kept on each (ongoing/daily) booking, as a percentage. */
export const PLATFORM_COMMISSION_PCT = 15;

/** Additional commission the platform takes on a customer's first booking, as a percentage. */
export const FIRST_BOOKING_COMMISSION_PCT = 5;

/** Gross SAR a credit-based class is worth at the given conversion rate. */
export function creditsToSar(
  credits: number,
  creditAmount: number = CREDIT_AMOUNT,
  sarAmount: number = CREDIT_VALUE_SAR,
): number {
  return creditAmount > 0 ? (credits / creditAmount) * sarAmount : 0;
}

/** Net SAR a partner earns after the platform commission is deducted. */
export function studioEarning(
  gross: number,
  commissionPct: number = PLATFORM_COMMISSION_PCT,
): number {
  return gross * (1 - commissionPct / 100);
}
