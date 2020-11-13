import { Player } from './player.model';

export class TeamPlayer {

    constructor(
        public id: number,
        public points: number,
        public onBench: boolean,
        public player: Player
    ) { }

}