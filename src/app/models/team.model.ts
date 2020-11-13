import { TeamPlayer } from "./team-player.model";

export class Team {

    constructor(
        public id: number,
        public name: String,
        public freeTransfers: number,
        public totalPoints: number,
        public userId: number,
        public captainId: number,
        public viceCaptainId: number,
        public teamPlayers: TeamPlayer[]
    ) { }

}