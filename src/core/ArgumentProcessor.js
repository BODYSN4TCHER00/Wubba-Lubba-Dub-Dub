export class ArgumentProcessor {
    /**
     * Processes and validates command-line arguments.
     * @param {string[]} args - Array of command-line arguments.
     * @returns {{numBoxes: number, mortyPath: string, mortyClassName: string}} Game configuration.
     * @throws {Error} If arguments are incorrect.
     */
    static process(args) {
        if (args.length !== 3) {
            throw new Error('Incorrect number of arguments. Expected 3 (num_boxes, morty_file_path, morty_class_name).');
        }

        const numBoxes = parseInt(args[0], 10);
        const mortyPath = args[1];
        const mortyClassName = args[2];

        if (isNaN(numBoxes) || numBoxes < 3) {
            throw new Error(`Invalid box count. Must be an integer greater than 2. Received: ${args[0]}.`);
        }

        // Basic path and class name validation
        if (!mortyPath || !mortyClassName) {
            throw new Error('Morty file path and class name cannot be empty.');
        }

        return { numBoxes, mortyPath, mortyClassName };
    }
}