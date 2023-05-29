import { useState } from 'react'
import { Event } from './types'
import { CustomDate } from './CustomDate'
import './CreateEvent.css'

type CreateEventProps = {
    date: CustomDate,
    i: number,
    j: number,
    setShow: (a: boolean) => void
    createEvent: (i:number, j:number, event: Event) => void
}

export default function CreateEvent({
    date,
    i,
    j,
    setShow,
    createEvent,
}: CreateEventProps) {
    const [eventData, setEventData] = useState<Event>({
        summary: '',
        description: '',
    })

    const handleEventDataChange = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.currentTarget
        setEventData((prevEventData) => ({ ...prevEventData, [name]: value }))
    }

    return (
        <form
            className="modal"
            style={{
                '--date-top': i,
                '--date-left': j,
                '--modal-offset':
                    j < 7 / 2
                        ? 'calc(var(--date-width) + 3px )'
                        : 'calc(var(--modal-width) * -1)',
            }}
        >
            <h4 className="modal-header">
                {date.toDateString()}
            </h4>
            <h4>Summary:</h4>
            <input
                name="summary"
                placeholder="Enter a summary"
                onChange={(event) => handleEventDataChange(event)}
            />
            <h5>Description:</h5>
            <textarea
                name="description"
                placeholder="Enter a description"
                rows={4}
                onChange={(event) => handleEventDataChange(event)}
            />
            <div className="modal-buttons">
                <button onClick={() => createEvent(i, j, eventData)}>
                    Create Event
                </button>
                <button onClick={() => setShow(false)}>Cancel</button>
            </div>
        </form>
    )
}
