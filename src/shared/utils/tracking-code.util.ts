export function generateTrackingCode(): string {
  const prefix = "COO";
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNumber}`;
}
