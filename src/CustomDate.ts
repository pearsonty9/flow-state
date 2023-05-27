import { Event } from './types'

export class CustomDate extends Date {
    events: Array<Event> = []
    constructor(
        year: number,
        month: number,
        day: number,
        hours: number,
        minutes: number,
        seconds: number
    ) {
        if (year) super(year, month, day, hours, minutes, seconds)
        else super()
    }
}
