import { useEffect, useState } from 'react'
import './App.css'

function App() {

    const [weeks, setWeeks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(-1);

    useEffect(() => {
        let emptyWeeks = []
        for (let i = 0; i < 5; i++) {
            let week = []
            for (let j = 0; j < 7; j++) {
                week.push({date: i * 7 + j, isSelected: false})
            }
            emptyWeeks.push(week)
        }
        setWeeks(emptyWeeks)
    }, [])

    const toggleSelectedState = (i, j) => {
        setSelectedDate(i * 7 + j)
    }

    return (+
        <div className='month'>
            {weeks.map((days, i) => (
                <>
                    {days.map((day, j) => (
                        <div key={day.date} 
                            className={"day " + (day.date == selectedDate ? "selected": "")} 
                            onClick={() => toggleSelectedState(i, j)}
                        >
                            {day.isSelected.toString()}
                        </div>
                    ))}
                </>            
            ))}
        </div>
    )
}

export default App
