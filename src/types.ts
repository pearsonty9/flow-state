export type Date = {
    month: string
    day: number
    events: Array<Event>
}

export type Event = {
    summary: string
    description: string
}
