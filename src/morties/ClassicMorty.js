import { AbstractMorty } from '../core/AbstractMorty.js';

export class ClassicMorty extends AbstractMorty {
    constructor(numBoxes, randomProtocol, mortyId) {
        super(numBoxes, randomProtocol, mortyId);
        this.name = "ClassicMorty";
    }

    getHidingFlavorText() {
        return "Oh geez, Rick, I'm gonna hide your portal gun in one of the boxes, okay?";
    }
    
    /**
     * Implements ClassicMorty's strategy: always keeps the gun, chooses which 
     * non-gun box to keep using the fair random protocol if Rick was correct.
     * * @param {number} initialRickGuess - The index of the box Rick initially selected.
     * @param {number} portalGunLocation - The index of the box containing the portal gun.
     * @returns {Promise<number[]>} The indices of the N - 2 boxes to be removed.
     */
    async removeEmptyBoxes(initialRickGuess, portalGunLocation) {
        const allBoxes = Array.from({ length: this.numBoxes }, (_, i) => i);
        const countToRemove = this.numBoxes - 2;
        
        // Boxes that are NOT the portal gun. This list has N-1 elements.
        const emptyOrGuessBoxes = allBoxes.filter(box => box !== portalGunLocation);

        let boxesToRemove = [];
        
        if (initialRickGuess === portalGunLocation) {
            // Case 1: Rick guessed correctly. Morty MUST choose one of the N-1 non-guess boxes to KEEP.
            
            // The candidates for being KEPT (other than Rick's guess/gun) are all non-gun boxes.
            const boxesAvailableToKeep = emptyOrGuessBoxes; 
            
            // The random range for the decision is the number of boxes available to keep (N-1).
            const randomRange = this.numBoxes - 1; 

            // The fair random number determines the INDEX of the box in the 'boxesAvailableToKeep' list to KEEP.
            const keepIndex = await this.randomProtocol.generateFairValue(
                randomRange,
                'to select a box to keep, since you guessed correctly'
            );
            
            const boxToKeep = boxesAvailableToKeep[keepIndex];
            
            // Boxes to remove are all candidates EXCEPT the one chosen to keep.
            boxesToRemove = boxesAvailableToKeep.filter(box => box !== boxToKeep);

        } else {
            // Case 2: Rick guessed incorrectly. Morty is forced to KEEP Rick's box AND the gun.
            // He MUST remove all other N-2 empty boxes that are not Rick's guess.
            
            // Candidate boxes for removal are all empty boxes EXCEPT Rick's initial guess.
            const forcedRemovalCandidates = emptyOrGuessBoxes.filter(box => box !== initialRickGuess);
            
            // Morty is forced to remove all of them.
            boxesToRemove.push(...forcedRemovalCandidates);

            // Per instructions: generate a fair random value for protocol consistency, but don't use it for the decision.
            // We use a random range that forces the user to input *some* number for the second HMAC check.
            await this.randomProtocol.generateFairValue(
                this.numBoxes - 1, 
                'to keep the protocol consistent (value is not used by ClassicMorty in this case)'
            );
        }

        if (boxesToRemove.length !== countToRemove) {
             throw new Error(`Game error: The ClassicMorty implementation has a bug. Please contact the developer.`);
        }
        
        return boxesToRemove;
    }

    calculateTheoreticalProbabilities() {
        const stayWin = 1 / this.numBoxes;
        const switchWin = (this.numBoxes - 1) / this.numBoxes;
        
        return { switchWin, stayWin };
    }
}