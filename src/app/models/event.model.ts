export interface EventModel {
    id?: string;
    name: string;
    startTime: number;
    endTime: number;
    type: string;
    venueId: string;
    classLevel?: string;
    instructorIds?: string[];
}
