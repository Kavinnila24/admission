// utils/hashUtils.js

/**
 * Hashes an input string to a positive 32-bit integer using FNV-1a.
 * @param {string} input The string to hash, like a user ID.
 * @returns {number} The resulting hash as a positive number.
 */
export function hashToAppId(input) {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0); // Return positive 32-bit unsigned integer
}