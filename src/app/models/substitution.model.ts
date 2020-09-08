import { Player } from '../models/player.model';
import { MatchEvent } from './match-event.model';
import { Club } from './club.model';

export class Substitution extends MatchEvent {

    constructor(
        public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public matchId: number,
        public minute: String,
        public club: Club,
        public inPlayer: Player,
        public outPlayer: Player
    ) {
        super(id, createdOn, modifiedOn, matchId, minute, club);
    }

}