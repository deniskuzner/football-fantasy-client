import { Gameweek } from './gameweek.model';
import { Player } from './player.model';

export class PlayerGameweekPerformance {

    constructor(
        public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public gameweek: Gameweek,
        public player: Player,
        public points: number
    ) {}

}