import * as React from 'react'
import { useState } from 'react'
import { Date, Event } from './types'
import './CreateEvent.css'

type CreateEventProps = {
    date: Date
    setShow: (a: boolean) => void
    createEvent: (date: Date, event: Event) => void
}

export default function CreateEvent({
    date,
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
        <form className="modal">
            <h4 className="modal-header">
                {date.month} {date.day}
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
                <button onClick={() => createEvent(date, eventData)}>
                    Create Event
                </button>
                <button onClick={() => setShow(false)}>Cancel</button>
            </div>
        </form>
    )
}
