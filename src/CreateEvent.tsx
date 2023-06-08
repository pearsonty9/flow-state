import { CalendarEvent } from './types';
import { CustomDate } from './CustomDate';
import './CreateEvent.css';

type CreateEventProps = {
    date: CustomDate;
    i: number;
    j: number;
    setShow: (a: boolean) => void;
    createEvent: (i: number, j: number, event: CalendarEvent) => void;
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

export default function CreateEvent({ date, i, j, setShow, createEvent }: CreateEventProps) {
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
        createEvent(i, j, calendarEvent);
    };

    const convertStringToDate = (string: string) => {
        if (string.length === 0) return undefined;
        else return new Date(string);
    };

    return (
        <form
            className="modal"
            style={
                {
                    '--date-top': i,
                    '--date-left': j,
                    '--modal-offset': j < 7 / 2 ? 'calc(var(--date-width) + 3px )' : 'calc(var(--modal-width) * -1)'
                } as React.CSSProperties
            }
            onSubmit={(event: React.FormEvent<CustomForm>) => handleSubmit(event)}
        >
            <h4 className="modal-header">{date.toDateString()}</h4>
            <label htmlFor="summary">Summary:</label>
            <input name="summary" placeholder="Enter a summary" required />
            <label htmlFor="description">Description:</label>
            <textarea name="description" placeholder="Enter a description" rows={4} />
            <label htmlFor="startDate">Start Date:</label>
            <input type="datetime-local" name="startDate" />
            <label htmlFor="endDate">End Date:</label>
            <input type="datetime-local" name="endDate" />
            <label htmlFor="dueDate">Due Date:</label>
            <input type="datetime-local" name="dueDate" />
            <div className="modal-buttons">
                <button type="submit">Create Event</button>
                <button onClick={() => setShow(false)}>Close</button>
            </div>
        </form>
    );
}
