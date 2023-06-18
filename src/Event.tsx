import { CalendarEvent, CustomDate, EventModalState } from './types';
import './Event.css';

type EventProps = {
    state: EventModalState;
    i: number;
    j: number;
    date: CustomDate;
    eventIndex: number | undefined;
    event: CalendarEvent | undefined;
    setState: (state: EventModalState) => void;
    createEvent: (i: number, j: number, event: CalendarEvent) => void;
    editEvent: (i: number, j: number, eventIndex: number | undefined, event: CalendarEvent) => void;
    deleteEvent: (i: number, j: number, eventIndex: number | undefined) => void;
    closeModal: () => void;
};

const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};

interface CustomElements extends HTMLFormControlsCollection {
    summary: HTMLInputElement;
    description: HTMLInputElement;
    startDate: HTMLInputElement;
    endDate: HTMLInputElement;
    dueDate: HTMLInputElement;
}

interface CustomForm extends HTMLFormElement {
    readonly elements: CustomElements;
}

export default function Event({
    state,
    i,
    j,
    date,
    eventIndex,
    event,
    setState,
    createEvent,
    editEvent,
    deleteEvent,
    closeModal
}: EventProps) {
    const handleSubmit = (event: React.FormEvent<CustomForm>) => {
        event.preventDefault();
        const target = event.currentTarget.elements;
        const calendarEvent = {
            summary: target.summary.value,
            description: target.description.value,
            startDate: convertStringToDate(target.startDate.value),
            endDate: convertStringToDate(target.endDate.value),
            dueDate: convertStringToDate(target.dueDate.value)
        };
        if (state === EventModalState.EditEvent) editEvent(i, j, eventIndex, calendarEvent);
        else createEvent(i, j, calendarEvent);
    };

    const convertStringToDate = (string: string) => {
        if (string.length === 0) return undefined;
        else return new Date(string);
    };

    const modalStyle = {
        '--date-top': i,
        '--date-left': j,
        '--modal-offset': j < 7 / 2 ? 'calc(var(--date-width) + 3px )' : 'calc(var(--modal-width) * -1)',
        '--modal-height': state === EventModalState.ShowEvent ? '200px' : '300px'
    } as React.CSSProperties;

    return (
        <>
            {state === EventModalState.CreateEvent || state === EventModalState.EditEvent ? (
                <form
                    onSubmit={(event: React.FormEvent<CustomForm>) => handleSubmit(event)}
                    className="modal"
                    style={modalStyle}
                >
                    <h4 className="modal-header">{date.toDateString()}</h4>
                    <label htmlFor="summary">Summary:</label>
                    <input
                        id="summary"
                        name="summary"
                        placeholder="Enter a summary"
                        defaultValue={state === EventModalState.EditEvent ? event?.summary : ''}
                        required
                    />
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter a description"
                        rows={4}
                        defaultValue={state === EventModalState.EditEvent ? event?.description : ''}
                    />
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        defaultValue={
                            state === EventModalState.EditEvent
                                ? event?.startDate
                                      ?.toISOString()
                                      .substring(0, event?.startDate?.toISOString().indexOf('T') + 6)
                                : undefined
                        }
                    />
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        name="endDate"
                        defaultValue={
                            state === EventModalState.EditEvent
                                ? event?.endDate
                                      ?.toISOString()
                                      .substring(0, event?.endDate?.toISOString().indexOf('T') + 6)
                                : undefined
                        }
                    />
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="datetime-local"
                        id="dueDate"
                        name="dueDate"
                        defaultValue={
                            state === EventModalState.EditEvent
                                ? event?.dueDate
                                      ?.toISOString()
                                      .substring(0, event?.dueDate?.toISOString().indexOf('T') + 6)
                                : undefined
                        }
                    />
                    <div className="modal-buttons">
                        <button type="submit">{state === EventModalState.EditEvent ? 'Save' : 'Create Event'}</button>
                        {state === EventModalState.EditEvent && (
                            <button onClick={() => deleteEvent(i, j, eventIndex)}>Delete</button>
                        )}
                        <button onClick={closeModal}>Close</button>
                    </div>
                </form>
            ) : (
                <div className="modal" style={modalStyle}>
                    <h4 className="modal-header">{date.toDateString()}</h4>
                    <h5>Summary: </h5>
                    <h5 className="event-details">{event?.summary}</h5>
                    <h5>Description: </h5>
                    <h5 className="event-details">{event?.description}</h5>
                    <h5>Start Date: </h5>
                    <h5 className="event-details">{event?.startDate?.toLocaleDateString('en-US', options)}</h5>
                    <h5>End Date: </h5>
                    <h5 className="event-details">{event?.endDate?.toLocaleDateString('en-US', options)}</h5>
                    <h5>Due Date: </h5>
                    <h5 className="event-details">{event?.dueDate?.toLocaleDateString('en-US', options)}</h5>
                    <div className="modal-buttons">
                        <button onClick={() => setState(EventModalState.EditEvent)}>Edit</button>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}
