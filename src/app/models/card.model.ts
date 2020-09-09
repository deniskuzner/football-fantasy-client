import { Player } from '../models/player.model';
import { MatchEvent } from './match-event.model';
import { Club } from './club.model';

export class Card extends MatchEvent {

    constructor(
        public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public matchId: number,
        public minute: String,
        public result: String,
        public club: Club,
        public card: String,
        public player: Player
    ) {
        super(id, createdOn, modifiedOn, matchId, minute, result, club);
    }

}