export class PeopleOccupation {
    occupationId: number;
    peopleId: number;
    occupationDescription: string | null;
    peopleName: string | null;

    constructor(occupationId: number, peopleId: number, occupationDescription: string | null, peopleName: string | null) {
        this.occupationId = occupationId;
        this.peopleId = peopleId;
        this.occupationDescription = occupationDescription;
        this.peopleName = peopleName;
    }
} 