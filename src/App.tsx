import * as React from 'react'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CreateEvent from './CreateEvent'
import { Date, Event } from './types'
import './App.css'

function App() {
    const [weeks, setWeeks] = useState<Date[][]>([])
    const [focusedDate, setFocusedDate] = useState(-1)
    const [showCreateEvent, setShowCreateEvent] = useState(false)

    useEffect(() => {
        const emptyWeeks: Date[][] = []
        for (let i = 0; i < 5; i++) {
            const week: Date[] = []
            for (let j = 0; j < 7; j++) {
                week.push({ day: i * 7 + j, month: 'Month', events: [] })
            }
            emptyWeeks.push(week)
        }
        setWeeks(emptyWeeks)
    }, [])

    const handleChangeDate = (
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.KeyboardEvent<HTMLDivElement>,
        i: number,
        j: number
    ) => {
        event?.stopPropagation()
        const date = i * 7 + j
        if (date === focusedDate) {
            console.log(`create event for ${date}`)
            setShowCreateEvent(true)
        } else if (showCreateEvent) setShowCreateEvent(false)
        console.log(weeks[Math.floor(date / 7)][date % 7])
    }

    const createEvent = (date: Date, event: Event) => {
        const updatedWeeks = [...weeks]
        updatedWeeks[Math.floor(date.day / 7)][date.day % 7].events.push(event)
        setWeeks(updatedWeeks)
        setShowCreateEvent(false)
    }

    return (
        <div style={{ position: 'relative' }}>
            <div className="month">
                {weeks.map((days, i) => {
                    return days.map((date, j) => (
                        <div
                            key={date.day}
                            tabIndex={date.day + 1}
                            className={
                                'day ' +
                                (date.day == focusedDate ? 'selected' : '')
                            }
                            onFocus={() => setFocusedDate(date.day)}
                            onClick={() => setShowCreateEvent(false)}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter')
                                    handleChangeDate(event, i, j)
                            }}
                        >
                            {date.day}
                            <ul>
                                {date.events.map((event) => (
                                    <p className='event'>{event.summary}</p>
                                ))}
                            </ul>
                            <FontAwesomeIcon
                                className="add"
                                icon={faPlus}
                                onClick={(
                                    event: React.MouseEvent<HTMLDivElement>
                                ) => handleChangeDate(event, i, j)}
                            />
                        </div>
                    ))
                })}
            </div>
            {showCreateEvent && (
                <CreateEvent
                    date={weeks[Math.floor(focusedDate / 7)][focusedDate % 7]}
                    setShow={setShowCreateEvent}
                    createEvent={createEvent}
                />
            )}
        </div>
    )
}

export default App
