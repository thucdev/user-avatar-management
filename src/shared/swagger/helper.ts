import crypto from 'crypto';

export function sanitizeJson(input: Record<string, unknown> | string): string {
  try {
    if (typeof input === 'string') {
      input = JSON.parse(input);
    }

    return JSON.stringify(input, null, '\t');
  } catch (e) {
    return input as string;
  }
}

export function sortObjectKeysAndHash(payload) {
  const sortedKeys = Object.keys(payload).sort();

  const sortedPayload = {};
  sortedKeys.forEach((key) => {
    sortedPayload[key] = payload[key];
  });

  const payloadString = Object.keys(sortedPayload)
    .sort()
    .map((key) => `${key}=${sortedPayload[key]}`)
    .join('&');

  // Hash the sorted string using MD5
  const hash = crypto
    .createHmac('md5', 'bPF1k9fXS7IjcrMU')
    .update(payloadString)
    .digest('hex');

  sortedPayload['sign'] = hash;
  return sortedPayload;
}
