import crypto from 'crypto';

export const genid = () => {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(crypto.randomFillSync(new Uint8Array(8)))
    .map((n) => S[n % S.length])
    .join('');
};
