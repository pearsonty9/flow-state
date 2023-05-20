import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './App.css'

function App() {
    type day = {
        date: number,
    }
    const [weeks, setWeeks] = useState<day[][]>([]);
    const [focusedDate, setFocusedDate] = useState(-1);

    useEffect(() => {
        const emptyWeeks: day[][] = []
        for (let i = 0; i < 5; i++) {
            const week: day[] = []
            for (let j = 0; j < 7; j++) {
                week.push({date: i * 7 + j})
            }
            emptyWeeks.push(week)
        }
        setWeeks(emptyWeeks)
    }, [])

    const handleDateClick = (i: number, j: number) => {
        const date = i * 7 + j;
        if (date === focusedDate) {
            console.log(`create event for ${date}`);
        }
    }

    return (
        <div className='month'>
            {weeks.map((days, i) => {
                return days.map((day, j) => (
                    <div key={day.date}
                        tabIndex={day.date+1}
                        className={"day " + (day.date == focusedDate ? "selected": "")}
                        onFocus={() => setFocusedDate(i * 7 + j)}
                        onKeyUp={(event) => {if (event.key === "Enter") handleDateClick(i, j)}}
                    >
                        {day.date}
                        <FontAwesomeIcon 
                            className="add" 
                            icon={faPlus}
                            onClick={() => handleDateClick(i, j)}
                        />
                    </div>
                ))})}
        </div>
    )
}

export default App
