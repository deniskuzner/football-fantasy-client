import { Club } from './club.model';
import { Team } from './team.model';

export class User {

    constructor(
        public id: number,
        public username: string,
        public password: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public gender: string,
        public birthDate: string,
        public phoneNumber: string,
        public favouriteClubId: number,
        public team: Team
    ) {}

}