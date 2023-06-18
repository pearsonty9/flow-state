export type CalendarEvent = {
    summary: string;
    description: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    dueDate: Date | undefined;
};

export class CustomDate extends Date {
    events: Array<CalendarEvent> = [];
    constructor(year: number, month: number, day: number) {
        if (year) super(year, month, day);
        else super();
    }
}

export const enum EventModalState {
    CreateEvent,
    EditEvent,
    ShowEvent
}

export const enum Day {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}
