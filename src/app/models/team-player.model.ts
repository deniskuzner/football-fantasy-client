import { Player } from './player.model';

export class TeamPlayer {

    constructor(
        public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public points: number,
        public onBench: boolean,
        public player: Player
    ) { }

}