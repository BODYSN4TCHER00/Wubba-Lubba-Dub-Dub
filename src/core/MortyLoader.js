import path from 'path';
import { AbstractMorty } from './AbstractMorty.js';

export class MortyLoader {
    /**
     * Dynamically loads the Morty class from the specified path.
     * @param {string} mortyPath - File path to the Morty implementation.
     * @param {string} mortyClassName - The name of the class to load.
     * @returns {Promise<typeof AbstractMorty>} The loaded Morty class.
     * @throws {Error} If loading fails or the class is not a valid Morty.
     */
    static async load(mortyPath, mortyClassName) {
        let absolutePath = path.resolve(mortyPath);

        try {
            // Use 'file://' protocol for dynamic imports on Windows and Linux
            const module = await import(`file://${absolutePath}`);
            const MortyClass = module[mortyClassName];

            if (!MortyClass) {
                throw new Error(`Class "${mortyClassName}" not found in file: ${mortyPath}.`);
            }
            
            // Simple check to ensure it's a class and is a subclass of AbstractMorty
            if (!(MortyClass.prototype instanceof AbstractMorty)) {
                throw new Error(`Class "${mortyClassName}" must extend AbstractMorty.`);
            }

            return MortyClass;

        } catch (e) {
            if (e.code === 'ERR_MODULE_NOT_FOUND' || e.message.includes('not found')) {
                 throw new Error(`Morty implementation file not found at: ${mortyPath}.`);
            }
            throw new Error(`Failed to load Morty implementation: ${e.message}`);
        }
    }
}