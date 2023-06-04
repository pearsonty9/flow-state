import { CalendarEvent } from './types'
import { CustomDate } from './CustomDate'
import './CreateEvent.css'

type CreateEventProps = {
    date: CustomDate
    i: number
    j: number
    setShow: (a: boolean) => void
    createEvent: (i: number, j: number, event: CalendarEvent) => void
}

export default function CreateEvent({ date, i, j, setShow, createEvent }: CreateEventProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const calendarEvent = {
            summary: event.target['summary'].value,
            description: event.target['description'].value,
            startDate: convertStringToDate(event.target['start-date'].value),
            endDate: convertStringToDate(event.target['end-date'].value),
            dueDate: convertStringToDate(event.target['due-date'].value),
        }
        createEvent(i, j, calendarEvent)
    }

    const convertStringToDate = (string: string) => {
        if (string.length === 0)
            return undefined
        else
            return new Date(string)
    }

    return (
        <form
            className="modal"
            style={{
                '--date-top': i,
                '--date-left': j,
                '--modal-offset': j < 7 / 2 ? 'calc(var(--date-width) + 3px )' : 'calc(var(--modal-width) * -1)',
            }}
            onSubmit={(event) => handleSubmit(event)}
        >
            <h4 className="modal-header">{date.toDateString()}</h4>
            <label htmlFor="summary">Summary:</label>
            <input name="summary" placeholder="Enter a summary" required />
            <label htmlFor="description">Description:</label>
            <textarea name="description" placeholder="Enter a description" rows={4} />
            <label htmlFor="start-date">Start Date:</label>
            <input type="datetime-local" name="start-date" />
            <label htmlFor="end-date">End Date:</label>
            <input type="datetime-local" name="end-date" />
            <label htmlFor="due-date">Due Date:</label>
            <input type="datetime-local" name="due-date" />
            <div className="modal-buttons">
                <button type="submit">Create Event</button>
                <button onClick={() => setShow(false)}>Close</button>
            </div>
        </form>
    )
}
