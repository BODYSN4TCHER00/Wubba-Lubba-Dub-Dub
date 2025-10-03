import crypto from 'crypto';
import readline from 'readline';
import { KeyManager } from './KeyManager.js';

export class RandomProtocol {
    /**
     * @param {string} mortyName - The name of the Morty instance for output.
     * @param {readline.Interface} rl - Optional shared readline interface to use.
     */
    constructor(mortyName, rl) {
        this.mortyName = mortyName;
        this.protocolHistory = []; // Stores the key and values for verification
        if (rl) {
            this.rl = rl;
            this._ownsRl = false;
        } else {
            this.rl = readline.createInterface({ 
                input: process.stdin, 
                output: process.stdout,
                terminal: false 
            });
            this._ownsRl = true;
        }
    }

    /**
     * Prompts the user for a value within a specified range.
     * @param {number} min - The minimum inclusive value (usually 0).
     * @param {number} max - The maximum exclusive value (e.g., N).
     * @param {string} promptMessage - The specific message to show the user.
     * @returns {Promise<number>} Rick's validated integer value.
     */
    async #getUserInput(min, max, promptMessage) {
        return new Promise((resolve, reject) => {
            const range = `[${min},${max})`;
            const question = `${this.mortyName}: Rick, enter your number ${range} ${promptMessage}\nRick: `;
            
            try {
                this.rl.question(question, (answer) => {
                    const trimmed = answer.trim();
                    const value = parseInt(trimmed, 10);
                    
                    if (trimmed === '' || isNaN(value) || value < min || value >= max) {
                        console.log(`\nMorty: Aw jeez, Rick, that's not a valid number. Please enter a number between ${min} and ${max - 1}.\n`);
                        resolve(this.#getUserInput(min, max, promptMessage)); // Retry
                    } else {
                        resolve(value);
                    }
                });
            } catch (err) {
                reject(new Error('Input stream is not available. Please run the game interactively in a terminal.'));
            }
        });
    }

    /**
     * Generates a provably fair random integer in the range [0, N-1].
     * @param {number} N - The upper bound (exclusive).
     * @param {string} purpose - A description of what the random number is for (e.g., 'to select the gun location').
     * @returns {Promise<number>} The final collaborative, fair random value.
     */
    async generateFairValue(N, purpose) {
        // 1. Generate one-time secret key
        const secretKey = KeyManager.generateSecretKey();
        
        // 2. Generate Morty's secret value [0, N-1)
        // Use crypto.randomInt for cryptographically secure, uniformly distributed integer
        const mortyValue = crypto.randomInt(0, N); 
        
        // 3. Compute HMAC of Morty's value using the secret key
        // Note: The HMAC message is the Morty's value, which must be a consistent string representation.
        const hmac = crypto.createHmac('sha3-256', secretKey);
        hmac.update(String(mortyValue));
        const mortyHMAC = hmac.digest('hex').toUpperCase();

        console.log(`\n${this.mortyName}: HMAC: ${mortyHMAC}`);
        console.log(`\n${this.mortyName}: I'm using this for ${purpose}.`);
        
        // 4. Ask the user for Rick's value
        const rickValue = await this.#getUserInput(0, N, 'so you don\'t whine later that I cheated, alright?');

        // 5. Compute the final result using modular arithmetic
        const finalResult = (mortyValue + rickValue) % N;

        // 6. Store data for later verifiability
        this.protocolHistory.push({
            mortyValue,
            rickValue,
            finalResult,
            secretKey,
            mortyHMAC,
            N,
            purpose
        });

        return finalResult;
    }

    /**
     * Displays the history of the last completed random generation, revealing the secret key.
     */
    displayLastProtocolDetails() {
        const lastEntry = this.protocolHistory[this.protocolHistory.length - 1];
        if (!lastEntry) return;

        console.log(`\n${this.mortyName}: Aww man, my random value is ${lastEntry.mortyValue}.`);
        console.log(`\n${this.mortyName}: KEY: ${lastEntry.secretKey}`);
        console.log(`\n${this.mortyName}: So the fair number for '${lastEntry.purpose}' is (${lastEntry.mortyValue} + ${lastEntry.rickValue}) % ${lastEntry.N} = ${lastEntry.finalResult}.`);
    }

    /**
     * Clears the current readline interface.
     */
    close() {
        if (this._ownsRl) {
            this.rl.close();
        }
    }
}
