import { CalendarEvent } from './types'
import { CustomDate } from './CustomDate'
import './CreateEvent.css'

type EventProps = {
    date: CustomDate
    event: CalendarEvent | undefined
    i: number
    j: number
    setShow: (a: boolean) => void
}

const options: DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: "2-digit",
    minute: "2-digit",
}

export default function DisplayEvent({ date, event, i, j, setShow }: EventProps) {
    return (
        <div
            className="modal"
            style={{
                '--date-top': i,
                '--date-left': j,
                '--modal-offset': j < 7 / 2 ? 'calc(var(--date-width) + 3px )' : 'calc(var(--modal-width) * -1)',
                '--modal-height': '200px',
            }}
        >
            <h4 className="modal-header">{date.toDateString()}</h4>
            <h5>Summary: </h5>
            <h5 className='event-details'>{event?.summary}</h5>
            <h5>Description: </h5>
            <h5 className='event-details'>{event?.description}</h5>
            <h5>Start Date: </h5>
            <h5 className='event-details'>{event?.startDate?.toLocaleDateString('en-US', options)}</h5>
            <h5>End Date: </h5>
            <h5 className='event-details'>{event?.endDate?.toLocaleDateString('en-US', options)}</h5>
            <h5>Due Date: </h5>
            <h5 className='event-details'>{event?.dueDate?.toLocaleDateString('en-US', options)}</h5>
            <div className="modal-buttons">
                <button onClick={() => setShow(false)}>Close</button>
            </div>
        </div>
    )
}
