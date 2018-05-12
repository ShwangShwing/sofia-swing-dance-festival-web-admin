export interface EventModel {
    id?: string;
    name: string;
    startTime: number;
    endTime: number;
    type: string;
    venueId: string;
}

// tslint:disable-next-line:no-empty-interface
export interface MiscEventModel extends EventModel {

}

// tslint:disable-next-line:no-empty-interface
export interface PartyEventModel extends EventModel {

}

export interface MainClassEventModel extends EventModel {
    classLevel: string;
    instructorIds: string[];
}

export interface TasterClassEventModel extends EventModel {
    instructorIds: string[];
}
