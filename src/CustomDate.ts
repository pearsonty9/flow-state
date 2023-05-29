import { Event } from './types'

export class CustomDate extends Date {
    events: Array<Event> = []
    constructor(
        year: number,
        month: number,
        day: number,
    ) {
        if (year) super(year, month, day)
        else super()
    }
}
