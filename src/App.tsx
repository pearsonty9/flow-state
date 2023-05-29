import * as React from 'react'
import { useEffect, useState } from 'react'
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
    const [weeks, setWeeks] = useState<CustomDate[][]>([])
    const [focusedDate, setFocusedDate] = useState({ i: 1, j: today.getDate() })
    const [showCreateEvent, setShowCreateEvent] = useState(false)

    useEffect(() => {
        setupCalendarSimple()
    }, [])

    function setupCalendar() {
        const calendarWeeks: CustomDate[][] = []
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        const currentMonthEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
        let month = today.getMonth() !== 0 ? today.getMonth() - 1 : 11
        let date = 1

        for (let i = 0; i < MAX_WEEKS; i++) {
            const week: CustomDate[] = []
            if (month === lastMonthEnd.getMonth()) {
                if (lastMonthEnd.getDay() !== Day.Saturday) {
                    date = lastMonthEnd.getDate() - lastMonthEnd.getDay()
                    while (date <= lastMonthEnd.getDate()) {
                        week.push(new CustomDate(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), date))
                        date++
                    }
                }
                month = today.getMonth()
                date = 1
            }
            if (month === today.getMonth()) {
                while (week.length < DAYS_PER_WEEK) {
                    if (date > currentMonthEndDate) {
                        month = nextMonthStart.getMonth()
                        break
                    }
                    week.push(new CustomDate(today.getFullYear(), today.getMonth(), date))
                    date++
                }
            }
            if (month === nextMonthStart.getMonth() && week.length !== 0) {
                for (let k = 1; week.length < DAYS_PER_WEEK; k++) {
                    week.push(new CustomDate(nextMonthStart.getFullYear(), nextMonthStart.getMonth(), k))
                }
            }
            calendarWeeks.push(week)
        }
        setWeeks(calendarWeeks)
    }

    function setupCalendarSimple() {
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        const currentMonthEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
        let date

        const lastMonth: CustomDate[] = getCalendarDatesFromMonth(
            lastMonthEnd.getDate() - lastMonthEnd.getDay(),
            lastMonthEnd.getDate(),
            lastMonthEnd.getFullYear(),
            lastMonthEnd.getMonth()
        )
        const currentMonth: CustomDate[] = getCalendarDatesFromMonth(
            1,
            currentMonthEndDate,
            today.getFullYear(),
            today.getMonth()
        )
        const nextMonth: CustomDate[] = getCalendarDatesFromMonth(
            1,
            8 - (currentMonth.length % 7),
            nextMonthStart.getFullYear(),
            nextMonthStart.getMonth()
        )

        setWeeks([lastMonth, currentMonth, nextMonth])
    }

    function getCalendarDatesFromMonth(startDate: number, endDate: number, year: number, month: number) {
        const dates: CustomDate[] = []
        let date = startDate
        while (date < endDate) {
            dates.push(new CustomDate(year, month, date))
            date++
        }
        return dates
    }

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

    function calcDateIndex(month: number, date: number) {
        let index = 0
        if (month === 0) index = date % weeks[month].length
        if (month === 1) index = date + weeks[0].length
        if (month === 2) index = date + weeks[0].length + weeks[1].length
        return index
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
                            tabIndex={calcDateIndex(i, j)}
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
