import { AbstractMorty } from '../core/AbstractMorty.js';

export class LazyMorty extends AbstractMorty {
    constructor(numBoxes, randomProtocol, mortyId) {
        super(numBoxes, randomProtocol, mortyId);
        this.name = "LazyMorty";
    }

    getHidingFlavorText() {
        return "Uh, I'm hiding your portal gun now, Rick. Try not to break anything this time.";
    }

    /**
     * LazyMorty does not use the fair random protocol for box removal.
     * He removes the N-2 non-gun, non-guess boxes with the lowest indices.
     */
    async removeEmptyBoxes(initialRickGuess, portalGunLocation) {
        const boxesToRemove = [];
        const allBoxes = Array.from({ length: this.numBoxes }, (_, i) => i);
        const countToRemove = this.numBoxes - 2;

        // Candidate boxes: Must be empty AND not Rick's initial guess.
        const candidates = allBoxes.filter(
            box => box !== portalGunLocation && box !== initialRickGuess
        );
        
        // LazyMorty removes the lowest-indexed boxes from the candidates list.
        // The candidates array is already sorted by index (0, 1, 2...)
        boxesToRemove.push(...candidates.slice(0, countToRemove));
        
        // Since LazyMorty does not use the random protocol for the decision, 
        // a value must still be generated for protocol consistency, as if a choice was made.
        // He pretends to generate a number in a range of the number of boxes he needs to remove, which is (N-2).
        await this.randomProtocol.generateFairValue(
             this.numBoxes - 1, // Range of [0, N-1) is used in the example for the *second* generation.
             'to keep the protocol consistent (value is not used by LazyMorty)'
        );

        return boxesToRemove;
    }

    /**
     * Theoretical probability for Lazy Morty:
     * Since LazyMorty's behavior (which boxes he opens) doesn't change the initial probability
     * of the gun being in the guessed box, the probabilities remain the same as ClassicMorty/Monty Hall.
     */
    calculateTheoreticalProbabilities() {
        // P(Win|Stay) = P(Initial Guess Correct) = 1 / N
        const stayWin = 1 / this.numBoxes;
        // P(Win|Switch) = P(Initial Guess Wrong) = (N - 1) / N
        const switchWin = (this.numBoxes - 1) / this.numBoxes;

        return { switchWin, stayWin };
    }
}