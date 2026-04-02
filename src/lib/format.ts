const INR_TO_USD = 83;

export function convertToUSD(priceINR: number): number {
  return Math.round(priceINR / INR_TO_USD);
}

export function formatPrice(price: number, alreadyUSD = false): string {
  const usd = alreadyUSD ? price : convertToUSD(price);
  return '$' + usd.toLocaleString('en-US');
}

export function getDiscount(original: number, current: number): number {
  if (original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}
