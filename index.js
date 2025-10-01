import { ArgumentProcessor } from './src/core/ArgumentProcessor.js';
import { GameCore } from './src/core/GameCore.js';
import { MortyLoader } from './src/core/MortyLoader.js';

/**
 * Main function to run the RandM game.
 */
async function main() {
    try {
        const args = process.argv.slice(2);
        
        // 1. Argument Processing
        const config = ArgumentProcessor.process(args);

        // 2. Morty Loading
        const MortyClass = await MortyLoader.load(config.mortyPath, config.mortyClassName);
        
        // 3. Game Initialization and Run
        const game = new GameCore(config.numBoxes, MortyClass);
        await game.run();

    } catch (error) {
        // Output clear, user-friendly error message
        console.error(`\nERROR: ${error.message}\n`);
        console.log('---');
        console.log('Usage: node index.js <num_boxes> <morty_file_path> <morty_class_name>');
        console.log('  <num_boxes>: The number of boxes (integer > 2).');
        console.log('  <morty_file_path>: Path to the Morty implementation file (e.g., ./src/morties/ClassicMorty.js).');
        console.log('  <morty_class_name>: The name of the exported class (e.g., ClassicMorty).');
        console.log('\nExample: node index.js 3 ./src/morties/ClassicMorty.js ClassicMorty');
        process.exit(1);
    }
}

main();