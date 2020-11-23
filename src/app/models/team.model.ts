import { TeamPlayer } from "./team-player.model";
import { User } from './user.model';
import { TeamGameweekPerformance } from './team-gameweek-performance.model';

export class Team {

    constructor(
        public id: number,
        public name: String,
        public freeTransfers: number,
        public totalPoints: number,
        public captainId: number,
        public viceCaptainId: number,
        public moneyRemaining: number,
        public user: User,
        public teamPlayers: TeamPlayer[],
        public teamGameweekPerformances: TeamGameweekPerformance[]
    ) { }

}