/**
 * Base abstract class for all Morty implementations.
 * Morties are responsible for calculating theoretical probabilities and
 * determining the strategy for removing non-gun boxes.
 */
export class AbstractMorty {
    /**
     * @param {number} numBoxes - The total number of boxes in the game.
     * @param {RandomProtocol} randomProtocol - The protocol to use for all random number generation.
     * @param {number} mortyId - A unique ID for the Morty instance.
     */
    constructor(numBoxes, randomProtocol, mortyId) {
        if (new.target === AbstractMorty) {
            throw new TypeError("Cannot instantiate abstract class AbstractMorty directly.");
        }
        this.numBoxes = numBoxes;
        this.randomProtocol = randomProtocol;
        this.mortyId = mortyId;
    }

    /**
     * Implements Morty's strategy for removing N - 2 empty boxes.
     * This method must ensure that the box containing the gun is NEVER removed.
     * It may use the randomProtocol to decide which boxes to remove.
     * @param {number} initialRickGuess - The index of the box Rick initially selected.
     * @param {number} portalGunLocation - The index of the box containing the portal gun.
     * @returns {number[]} The indices of the N - 2 boxes to be removed.
     */
    removeEmptyBoxes(initialRickGuess, portalGunLocation) {
        throw new Error("This Morty implementation is incomplete. The removeEmptyBoxes method must be implemented.");
    }

    /**
     * Calculates the theoretical probability of winning if Rick switches boxes.
     * This depends entirely on Morty's removal strategy.
     * @returns {{switchWin: number, stayWin: number}} Theoretical probabilities (0 to 1).
     */
    calculateTheoreticalProbabilities() {
        throw new Error("This Morty implementation is incomplete. The calculateTheoreticalProbabilities method must be implemented.");
    }
    
    /**
     * Optional flavor text for Morty when they are hiding the gun.
     * @returns {string}
     */
    getHidingFlavorText() {
        return "Oh geez, Rick, I'm gonna hide your portal gun...";
    }
}