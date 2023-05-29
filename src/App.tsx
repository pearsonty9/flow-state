import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CreateEvent from './CreateEvent'
import { Event } from './types'
import { CustomDate } from './CustomDate.ts'
import './App.css'

function App() {
    const MAX_WEEKS = 6
    const DAYS_PER_WEEK = 7

    const enum Day {
        Sunday = 0,
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6,
    }

    const today = new Date()
    const [month, setMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth()));
    const [weeks, setWeeks] = useState<CustomDate[][]>([])
    const [focusedDate, setFocusedDate] = useState({ i: 0, j: 0 })
    const [showCreateEvent, setShowCreateEvent] = useState(false)

    const setupCalendar = useCallback((currentDate: Date) => {
        const calendarWeeks: CustomDate[][] = []
        const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
        const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        const currentMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        let date

        let week: CustomDate[] = []
        if (lastMonthEnd.getDay() !== Day.Saturday) {
            date = lastMonthEnd.getDate() - lastMonthEnd.getDay()
            while (date <= lastMonthEnd.getDate()) {
                week.push(new CustomDate(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), date))
                date++
            }
        }

        date = 1
        for (let i = 0; i < MAX_WEEKS; i++) {
            while (week.length < DAYS_PER_WEEK) {
                if (date > currentMonthEndDate) break
                week.push(new CustomDate(currentDate.getFullYear(), currentDate.getMonth(), date))
                date++
            }

            if (week.length > 0 && week.length < 7) {
                for (let k = 1; week.length < DAYS_PER_WEEK; k++)
                    week.push(new CustomDate(nextMonthStart.getFullYear(), nextMonthStart.getMonth(), k))
            }

            calendarWeeks.push(week)
            week = []
        }

        setWeeks(calendarWeeks)
    }, [Day.Saturday])

    useEffect(() => {
        setupCalendar(month)
    }, [month, setupCalendar])


    function handleCreateEvent(
        event: React.MouseEvent<SVGSVGElement> | React.KeyboardEvent<HTMLDivElement>,
        i: number,
        j: number
    ) {
        event?.stopPropagation()
        if (i === focusedDate.i && j === focusedDate.j) {
            setShowCreateEvent(true)
        } else if (showCreateEvent) setShowCreateEvent(false)
    }

    function createEvent(i: number, j: number, event: Event) {
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
                                (date.getTime() == weeks[focusedDate.i][focusedDate.j].getTime() ? 'selected ' : '') +
                                (date.getMonth() !== today.getMonth() ? 'faded' : '')
                            }
                            onFocus={() => {
                                setFocusedDate({ i, j })
                                console.log(date)
                            }}
                            onClick={() => setShowCreateEvent(false)}
                            onDoubleClick={() => {
                                if (date.getTime() == weeks[focusedDate.i][focusedDate.j].getTime())
                                    setShowCreateEvent(true)
                            }}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter') handleCreateEvent(event, i, j)
                            }}
                        >
                            {date.getDate()}
                            <ul>
                                {date.events.map((event, index) => (
                                    <p key={event.summary + index} className="event">{event.summary}</p>
                                ))}
                            </ul>
                            <FontAwesomeIcon
                                className="add"
                                icon={faPlus}
                                onClick={(event: React.MouseEvent<SVGSVGElement>) => handleCreateEvent(event, i, j)}
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
