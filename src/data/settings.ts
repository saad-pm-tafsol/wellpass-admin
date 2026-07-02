// Platform-wide credit economics.
//
// A credit-based class earns the studio `credits × CREDIT_VALUE_SAR`. This
// conversion rate is owned by the admin and adjusted from the Credit Conversion
// screen (/admin/credit-rate). Static demo defaults — no backend/persistence.

/** SAR value of one booking credit (gross). 1 credit = SAR 2.00 by default. */
export const CREDIT_VALUE_SAR = 2;

/** Platform commission kept on each booking, as a percentage. */
export const PLATFORM_COMMISSION_PCT = 15;

/** Gross SAR a credit-based class is worth at the given rate. */
export function creditsToSar(credits: number, rate: number = CREDIT_VALUE_SAR): number {
  return credits * rate;
}

/** Net SAR a studio earns after the platform commission is deducted. */
export function studioEarning(
  gross: number,
  commissionPct: number = PLATFORM_COMMISSION_PCT,
): number {
  return gross * (1 - commissionPct / 100);
}
