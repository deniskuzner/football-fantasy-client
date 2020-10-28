import { Club } from './club.model';

export class Player {

    constructor(public id: number,
        public createdOn: Date,
        public modifiedOn: Date,
        public url: string,
        public name: string,
        public nationality: string,
        public birthDate: string,
        public age: string,
        public position: string,
        public height: string,
        public weight: string,
        public image: string,
        public price: number,
        public totalPoints: number,
        public club: Club) {
    }

}