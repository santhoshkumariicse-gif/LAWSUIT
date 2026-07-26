export function redactPII(text: string): string {
  if (!text) return text;

  let redacted = text;

  // 1. Redact Indian Phone Numbers (e.g., +91 9876543210, 09876543210)
  const phoneRegex = /(?:\+91[\s-]?)?(?:\d{10})/g;
  redacted = redacted.replace(phoneRegex, "[REDACTED_PHONE]");

  // 2. Redact Aadhaar Numbers (e.g., 1234 5678 9012 or 1234-5678-9012)
  const aadhaarRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  redacted = redacted.replace(aadhaarRegex, "[REDACTED_AADHAAR]");

  // 3. Redact PAN Cards (e.g., ABCDE1234F)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
  redacted = redacted.replace(panRegex, "[REDACTED_PAN]");

  // 4. Redact Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  redacted = redacted.replace(emailRegex, "[REDACTED_EMAIL]");

  return redacted;
}
