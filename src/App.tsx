import * as React from 'react'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CreateEvent from './CreateEvent'
import { Event } from './types'
import { CustomDate } from './CustomDate.ts'
import './App.css'

function App() {
    const [weeks, setWeeks] = useState<CustomDate[][]>([])
    const [focusedDate, setFocusedDate] = useState({ i: 0, j: 0 })
    const [showCreateEvent, setShowCreateEvent] = useState(false)

    useEffect(() => {
        setupCalendar()
    }, [])

    const setupCalendar = () => {
        const currentDate = new Date()
        let month = currentDate.getMonth() - 1
        const emptyWeeks: CustomDate[][] = []
        const prevMonthEnd = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0,
            0,
            0,
            0
        )
        const nextMonthStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0,
            0,
            0,
            0
        )
        let date = 0
        for (let i = 0; i < 5; i++) {
            const week: CustomDate[] = []
            let calendarOffset = 0
            if (month === prevMonthEnd.getMonth()) {
                for (let j = 0; j <= prevMonthEnd.getDay(); j++) {
                    date = prevMonthEnd.getDate() - j
                    week.push(
                        new CustomDate(
                            prevMonthEnd.getFullYear(),
                            prevMonthEnd.getMonth(),
                            date,
                            0,
                            0,
                            0
                        )
                    )
                }
                month++
                calendarOffset = prevMonthEnd.getDay() + 1
            }
            if (month === currentDate.getMonth()) {
                for (let k = calendarOffset; week.length < 7; k++) {
                    date = i * 7 + k
                    week.push(
                        new CustomDate(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            date,
                            0,
                            0,
                            0
                        )
                    )
                }
            }
            console.log(week.map((day) => day.getDate()))
            emptyWeeks.push(week)
        }
        setWeeks(emptyWeeks)
    }

    const handleCreateEvent = (
        event:
            | React.MouseEvent<SVGSVGElement>
            | React.KeyboardEvent<HTMLDivElement>,
        i: number,
        j: number
    ) => {
        event?.stopPropagation()
        if (i === focusedDate.i && j === focusedDate.j) {
            setShowCreateEvent(true)
        } else if (showCreateEvent) setShowCreateEvent(false)
    }

    const createEvent = (i: number, j:number, event: Event) => {
        const updatedWeeks = [...weeks]
        updatedWeeks[i][j].events.push(event)
        setWeeks(updatedWeeks)
        setShowCreateEvent(false)
    }

    // console.log(showCreateEvent)

    return (
        <div style={{ position: 'relative' }}>
            <div className="month">
                <h4 className="day">Sunday</h4>
                <h4 className="day">Monday</h4>
                <h4 className="day">Tuesday</h4>
                <h4 className="day">Wednesday</h4>
                <h4 className="day">Thursday</h4>
                <h4 className="day">Friday</h4>
                <h4 className="day">Saturday</h4>
                {weeks.map((days, i) => {
                    return days.map((date, j) => (
                        <div
                            key={date.getTime()}
                            tabIndex={i * 7 + j + 1}
                            className={
                                'day ' +
                                (date.getTime() ==
                                weeks[focusedDate.i][focusedDate.j].getTime()
                                    ? 'selected'
                                    : '')
                            }
                            onFocus={() => setFocusedDate({ i, j })}
                            onClick={() => setShowCreateEvent(false)}
                            onDoubleClick={() => {
                                if (
                                    date.getTime() ==
                                    weeks[focusedDate.i][
                                        focusedDate.j
                                    ].getTime()
                                )
                                    setShowCreateEvent(true)
                            }}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter')
                                    handleCreateEvent(event, i, j)
                            }}
                        >
                            {date.getDate()}
                            <ul>
                                {date.events.map((event) => (
                                    <p className="event">{event.summary}</p>
                                ))}
                            </ul>
                            <FontAwesomeIcon
                                className="add"
                                icon={faPlus}
                                onClick={(
                                    event: React.MouseEvent<SVGSVGElement>
                                ) => handleCreateEvent(event, i, j)}
                            />
                        </div>
                    ))
                })}
            </div>
            {showCreateEvent && (
                <CreateEvent
                    date={weeks[focusedDate.i][focusedDate.j]}
                    i={focusedDate.i}
                    j={focusedDate.j}
                    setShow={setShowCreateEvent}
                    createEvent={createEvent}
                />
            )}
        </div>
    )
}

export default App
