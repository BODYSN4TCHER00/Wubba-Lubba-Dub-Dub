export class StatisticsCollector {
    constructor() {
        this.rounds = 0;
        this.wins_stay = 0;
        this.losses_stay = 0;
        this.wins_switch = 0;
        this.losses_switch = 0;
    }

    /**
     * Records the outcome of a single round.
     * @param {boolean} switched - True if Rick switched boxes.
     * @param {boolean} won - True if Rick won the round.
     */
    recordRound(switched, won) {
        this.rounds++;
        if (switched) {
            if (won) {
                this.wins_switch++;
            } else {
                this.losses_switch++;
            }
        } else {
            if (won) {
                this.wins_stay++;
            } else {
                this.losses_stay++;
            }
        }
    }

    /**
     * Calculates experimental probabilities.
     * @returns {{p_switch: number, p_stay: number}}
     */
    getExperimentalProbabilities() {
        const totalSwitchRounds = this.wins_switch + this.losses_switch;
        const totalStayRounds = this.wins_stay + this.losses_stay;
        
        const p_switch = totalSwitchRounds > 0 ? this.wins_switch / totalSwitchRounds : 0;
        const p_stay = totalStayRounds > 0 ? this.wins_stay / totalStayRounds : 0;

        return { p_switch, p_stay };
    }

    /**
     * Gets all statistics data.
     * @returns {object}
     */
    getData() {
        return {
            rounds_switch: this.wins_switch + this.losses_switch,
            rounds_stay: this.wins_stay + this.losses_stay,
            wins_switch: this.wins_switch,
            wins_stay: this.wins_stay,
            ...this.getExperimentalProbabilities()
        };
    }
}