export class ArgumentProcessor {
    /**
     * Processes and validates command-line arguments.
     * @param {string[]} args - Array of command-line arguments.
     * @returns {{numBoxes: number, mortyPath: string, mortyClassName: string}} Game configuration.
     * @throws {Error} If arguments are incorrect.
     */
    static process(args) {
        // Check number of arguments
        if (args.length === 0) {
            throw new Error('No arguments provided. You need to specify the number of boxes, Morty file path, and Morty class name.');
        }
        
        if (args.length === 1) {
            throw new Error('Only one argument provided. You need to provide 3 arguments: number of boxes, Morty file path, and Morty class name.');
        }
        
        if (args.length === 2) {
            throw new Error('Only two arguments provided. You need to provide 3 arguments: number of boxes, Morty file path, and Morty class name.');
        }
        
        if (args.length > 3) {
            throw new Error(`Too many arguments provided (${args.length}). You need exactly 3 arguments: number of boxes, Morty file path, and Morty class name.`);
        }

        const numBoxes = parseInt(args[0], 10);
        const mortyPath = args[1];
        const mortyClassName = args[2];

        // Validate box count
        if (isNaN(numBoxes)) {
            throw new Error(`Invalid box count. "${args[0]}" is not a valid number. Please provide an integer greater than 2.`);
        }
        
        if (numBoxes < 3) {
            throw new Error(`Invalid box count. The number of boxes must be greater than 2, but you provided ${numBoxes}.`);
        }

        // Validate Morty file path
        if (!mortyPath || mortyPath.trim() === '') {
            throw new Error('Morty file path is empty. Please provide the path to the Morty implementation file.');
        }

        // Validate Morty class name
        if (!mortyClassName || mortyClassName.trim() === '') {
            throw new Error('Morty class name is empty. Please provide the name of the Morty class to use.');
        }

        return { numBoxes, mortyPath, mortyClassName };
    }
}
