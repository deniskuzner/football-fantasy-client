import { Gameweek } from './gameweek.model';

export class TeamGameweekPerformance {

    constructor(
        public id: number,
        public points: number,
        public gameweek: Gameweek
    ) {}

}