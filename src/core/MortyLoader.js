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
                throw new Error(`The class "${mortyClassName}" was not found in the file "${mortyPath}". Please check that the class name is correct and the file exists.`);
            }
            
            // Simple check to ensure it's a class and is a subclass of AbstractMorty
            if (!(MortyClass.prototype instanceof AbstractMorty)) {
                throw new Error(`The class "${mortyClassName}" must extend AbstractMorty. Please make sure your Morty implementation extends the correct base class.`);
            }

            return MortyClass;

        } catch (e) {
            // Check if it's a class not found error (from our throw above)
            if (e.message.includes('was not found in the file') || e.message.includes('must extend AbstractMorty')) {
                throw e; // Re-throw our custom errors
            }
            
            // Check if it's a file not found error
            if (e.code === 'ERR_MODULE_NOT_FOUND' || e.message.includes('not found')) {
                 throw new Error(`The Morty implementation file was not found at "${mortyPath}". Please check that the file path is correct and the file exists.`);
            }
            
            // Generic error
            throw new Error(`Unable to load the Morty implementation from "${mortyPath}". Please check that the file exists and contains a valid Morty class.`);
        }
    }
}
