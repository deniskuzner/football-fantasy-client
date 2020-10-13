import { Match } from "./match.model";
import { PlayerGameweekPerformance } from "./player-gameweek-performance.model";

export class Gameweek {

    constructor(
        public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public orderNumber: number,
        public matches: Match[],
        public playerGameweekPerformances: PlayerGameweekPerformance[]
    ) {}
}