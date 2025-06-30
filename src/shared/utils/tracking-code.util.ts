export function generateTrackingCode(): string {
  const prefix = "COO";
  const date = new Date();
  const dateStr =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}-${dateStr}-${randomStr}`;
}

export function generateUniqueTrackingCode(
  existingCodes: string[] = []
): string {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const code = generateTrackingCode();
    if (!existingCodes.includes(code)) {
      return code;
    }
    attempts++;
  }

  const timestamp = Date.now().toString().slice(-4);
  return `COO-${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}${new Date()
    .getDate()
    .toString()
    .padStart(2, "0")}-${timestamp}`;
}
