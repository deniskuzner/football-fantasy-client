import { Club } from '../models/club.model';

export abstract class MatchEvent {

    constructor(
        public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public matchId: number,
        public minute: String,
        public result: String,
        public club: Club
    ) {}

}