import { RandomProtocol } from './RandomProtocol.js';
import { StatisticsCollector } from './StatisticsCollector.js';
import readline from 'readline';
import Table from 'cli-table3';

// Setup readline interface (shared with RandomProtocol for single process input)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * The main class coordinating the game logic, user interaction, and statistics.
 */
export class GameCore {
    /**
     * @param {number} numBoxes - The total number of boxes.
     * @param {typeof import('./AbstractMorty').AbstractMorty} MortyClass - The concrete Morty class to use.
     */
    constructor(numBoxes, MortyClass) {
        this.numBoxes = numBoxes;
        this.stats = new StatisticsCollector();
        this.rl = rl;
        this.mortyProtocol = new RandomProtocol('Morty', this.rl);
        this.morty = new MortyClass(numBoxes, this.mortyProtocol, 1);
        this.mortyName = MortyClass.name;
    }
    
    /**
     * Prompts Rick (the user) for their box selection or choice.
     * @param {number} N - The upper bound (exclusive).
     * @param {string} promptMessage - The message to display.
     * @returns {Promise<number>} Rick's validated choice.
     */
    async #getRickChoice(N, promptMessage) {
        return new Promise((resolve) => {
            const range = `[0,${N})`;
            const question = `\nMorty: ${promptMessage} [0,${N})?\nRick: `;
            
            this.rl.question(question, (answer) => {
                const choice = parseInt(answer.trim(), 10);
                if (isNaN(choice) || choice < 0 || choice >= N) {
                    console.log(`\nMorty: Aww geez, Rick, that's not a box. Select a number in the range ${range}.\n`);
                    resolve(this.#getRickChoice(N, promptMessage)); // Retry
                } else {
                    resolve(choice);
                }
            });
        });
    }

    /**
     * Executes a single round of the game.
     */
    async #playRound(roundNum) {
        console.log(`\n\n--- ROUND ${roundNum} ---`);

        // --- 1. Hiding the Portal Gun (Fair Random Generation) ---
        console.log(`\n${this.mortyName}: ${this.morty.getHidingFlavorText()}`);
        const portalGunLocation = await this.mortyProtocol.generateFairValue(
            this.numBoxes, 
            'to select the portal gun location'
        );

        // --- 2. Rick's Initial Guess ---
        const initialRickGuess = await this.#getRickChoice(
            this.numBoxes, 
            'Okay, okay, I hid the gun. What’s your guess'
        );

        // --- 3. Morty Removes Empty Boxes ---
        console.log(`\n${this.mortyName}: Now I'm going to remove ${this.numBoxes - 2} empty boxes...`);
        const removedBoxes = await this.morty.removeEmptyBoxes(initialRickGuess, portalGunLocation);
        
        // Determine the two remaining boxes
        const allBoxes = Array.from({ length: this.numBoxes }, (_, i) => i);
        const remainingBoxes = allBoxes.filter(box => !removedBoxes.includes(box));

        // Sanity check: must be exactly two boxes left
        if (remainingBoxes.length !== 2) {
            throw new Error(`Internal Error: Morty's removal strategy left ${remainingBoxes.length} boxes instead of 2.`);
        }
        
        // Find the "other" box (the one Rick didn't initially pick)
        const otherBox = remainingBoxes.find(box => box !== initialRickGuess);

        console.log(`\n${this.mortyName}: I'm keeping the box you chose, box ${initialRickGuess}, and box ${otherBox}.`);
        console.log(`\n${this.mortyName}: You can switch your box (enter 1 for box ${otherBox}), or stick with your current choice (enter 0 for box ${initialRickGuess}).`);

        // --- 4. Rick's Final Choice (Switch or Stay) ---
        // 0 to stay, 1 to switch. We use a range of [0, 2)
        const switchChoice = await this.#getRickChoice(
            2, 
            'Choose your final move (0=stay, 1=switch)'
        );

        const rickSwitched = (switchChoice === 1);
        const finalChoice = rickSwitched ? otherBox : initialRickGuess;

        // --- 5. Reveal Protocol Details and Result ---
        this.mortyProtocol.displayLastProtocolDetails();

        const rickWon = finalChoice === portalGunLocation;
        
        console.log(`\n${this.mortyName}: You portal gun is in the box ${portalGunLocation}.`);
        if (rickWon) {
            console.log(`\n${this.mortyName}: Awww yeah, you got it, Rick! You won!`);
        } else {
            console.log(`\n${this.mortyName}: Aww man, you lost, Rick. Now we gotta go on one of *my* adventures!`);
        }

        // --- 6. Record Statistics ---
        this.stats.recordRound(rickSwitched, rickWon);
    }
    
    /**
     * Prompts the user to play another round.
     * @returns {Promise<boolean>} True to play again, false to exit.
     */
    async #promptAnotherRound() {
        return new Promise((resolve) => {
            const question = `\n${this.mortyName}: D-do you wanna play another round (y/n)?\nRick: `;
            this.rl.question(question, (answer) => {
                const response = answer.trim().toLowerCase();
                if (response === 'y' || response === 'yes') {
                    resolve(true);
                } else if (response === 'n' || response === 'no') {
                    resolve(false);
                } else {
                    resolve(this.#promptAnotherRound()); // Retry
                }
            });
        });
    }

    /**
     * Prints the final game summary and statistics table.
     */
    #printSummary() {
        console.log(`\n\n${this.mortyName}: Okay… uh, bye!\n`);
        console.log('                  GAME STATS');
        
        const { p_switch, p_stay } = this.stats.getExperimentalProbabilities();
        const { switchWin, stayWin } = this.morty.calculateTheoreticalProbabilities();
        const statsData = this.stats.getData();
        
        const table = new Table({
            head: ['Game results', 'Rick switched', 'Rick stayed'],
            chars: { 
                'top': '—' , 'top-mid': '—' , 'top-left': '—' , 'top-right': '—',
                'bottom': '—' , 'bottom-mid': '—' , 'bottom-left': '—' , 'bottom-right': '—',
                'left': '|' , 'left-mid': '├' , 'mid': '─' , 'mid-mid': '┼',
                'right': '|' , 'right-mid': '┤' , 'middle': '│' 
            }
        });

        table.push(
            ['Rounds', statsData.rounds_switch, statsData.rounds_stay],
            ['Wins', statsData.wins_switch, statsData.wins_stay],
            ['P (estimate)', p_switch.toFixed(3), p_stay.toFixed(3)],
            ['P (exact)', switchWin.toFixed(3), stayWin.toFixed(3)]
        );

        console.log(table.toString());
    }

    /**
     * Runs the main game loop until the user chooses to exit.
     */
    async run() {
        let playAgain = true;
        let roundNum = 1;

        while (playAgain) {
            await this.#playRound(roundNum++);
            playAgain = await this.#promptAnotherRound();
        }

        this.#printSummary();
        this.mortyProtocol.close();
        this.rl.close();
    }
}