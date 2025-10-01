import crypto from 'crypto';

/**
 * Manages the generation of cryptographically secure random keys.
 */
export class KeyManager {
    /**
     * Generates a cryptographically secure random key of at least 256 bits (32 bytes).
     * @returns {string} The key as a hex string.
     */
    static generateSecretKey() {
        // 32 bytes = 256 bits
        return crypto.randomBytes(32).toString('hex');
    }
}