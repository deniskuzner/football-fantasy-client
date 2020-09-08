import { Club } from './club.model';
import { Gameweek } from './gameweek.model';
import { MatchEvent } from './match-event.model';

export class Match {

    constructor(
        public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public dateTime: Date,
        public url: String,
        public result: String,
        public venue: String,
        public host: Club,
        public guest: Club,
        public gameweek: Gameweek,
        public events: MatchEvent[]
    ) {}

}