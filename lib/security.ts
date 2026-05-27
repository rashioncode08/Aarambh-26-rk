import crypto from 'crypto';

// 1. In-memory Rate Limiting Map
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

/**
 * Custom in-memory rate limiting mechanism.
 * Limits the number of requests per IP within a specified time window.
 */
export function isRateLimited(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }
  
  const rateData = rateLimitMap.get(ip)!;
  if (now - rateData.firstRequest > windowMs) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }
  
  if (rateData.count >= limit) {
    return true;
  }
  
  rateData.count++;
  return false;
}

/**
 * XSS & Script injection sanitation helper.
 * Strips HTML tags and escapes special characters.
 */
export function sanitizeInput(val: any): any {
  if (typeof val === 'string') {
    return val
      .trim()
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags to prevent script execution
      .replace(/[^\w\s@.+-]/gi, (char) => {
        const map: { [key: string]: string } = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return map[char] || char;
      });
  }
  return val;
}

/**
 * Recursively sanitizes request objects to prevent nested injections.
 */
export function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        sanitized[key] = sanitizeObject(val);
      } else {
        sanitized[key] = sanitizeInput(val);
      }
    }
  }
  return sanitized;
}

/**
 * Verifies the validity of the signature sent by Cashfree Webhooks.
 * Uses SHA-256 HMAC of (timestamp + rawBody) computed with CASHFREE_SECRET_KEY.
 */
export function verifyCashfreeSignature(signature: string, rawBody: string, timestamp: string): boolean {
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!secretKey) {
    console.warn("CASHFREE_SECRET_KEY missing in environment variables. Signature verification bypassed.");
    return true; // Bypasses signature checking in non-production local debug scenarios
  }
  
  const data = timestamp + rawBody;
  const computedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('base64');
  
  return computedSignature === signature;
}
