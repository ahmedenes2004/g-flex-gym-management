import React from 'react';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const DAY_MAP = {
    1: 'Pazartesi',
    2: 'Salı',
    3: 'Çarşamba',
    4: 'Perşembe',
    5: 'Cuma',
    6: 'Cumartesi',
    0: 'Pazar'
};

const WeeklyCalendar = ({ classes = [], selectedDay = 'Hepsi', onDaySelect }) => {
    // Calculate class count per day
    const getCounts = () => {
        const counts = { Hepsi: classes.length };
        DAYS.forEach(d => counts[d] = 0);
        
        classes.forEach(c => {
            if (!c.schedule) return;
            const date = new Date(c.schedule);
            const dayName = DAY_MAP[date.getDay()];
            if (dayName) {
                counts[dayName] = (counts[dayName] || 0) + 1;
            }
        });
        return counts;
    };

    const counts = getCounts();

    return (
        <div className="calendar-tabs-container">
            <div className="calendar-tabs">
                <button 
                    className={`calendar-tab ${selectedDay === 'Hepsi' ? 'active' : ''}`}
                    onClick={() => onDaySelect('Hepsi')}
                >
                    Haftalık Program ({counts['Hepsi'] || 0})
                </button>
                {DAYS.map(day => (
                    <button 
                        key={day}
                        className={`calendar-tab ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => onDaySelect(day)}
                    >
                        {day} ({counts[day] || 0})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WeeklyCalendar;
