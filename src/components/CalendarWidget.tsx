import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '../types';

interface CalendarWidgetProps {
  appointments: Appointment[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
}

export default function CalendarWidget({ appointments, selectedDate, onSelectDate }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(selectedDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDayOfWeek = currentMonth.getDay(); // 0 (Sun) to 6 (Sat)
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  const renderDays = () => {
    const days = [];
    // empty slots
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-12" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      // Create local date correctly
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      // to pad strings easily:
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;
      
      const dayAppts = appointments.filter(a => a.appointment_date === dateStr && a.status !== 'cancelled');
      const hasAppts = dayAppts.length > 0;
      
      days.push(
        <button
          key={dateStr}
          onClick={() => onSelectDate(dateStr)}
          className={`h-10 sm:h-12 relative flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-sm'
              : 'hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] text-[#2D2C27] dark:text-[#EDEAE1]'
          } ${isToday && !isSelected ? 'border border-[#5A5A40] dark:border-[#A3B18A]' : ''}`}
        >
          <span>{i}</span>
          {hasAppts && (
            <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80 dark:bg-black/40' : 'bg-[#5A5A40] dark:bg-[#A3B18A]'}`} />
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] p-5 sm:p-7 border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-serif font-bold text-lg text-[#2D2C27] dark:text-[#EDEAE1] capitalize">
          {monthName}
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] rounded-full transition-colors text-[#6B6658] dark:text-[#A6A295] cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] rounded-full transition-colors text-[#6B6658] dark:text-[#A6A295] cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-[10px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295]">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderDays()}
      </div>
    </div>
  );
}
