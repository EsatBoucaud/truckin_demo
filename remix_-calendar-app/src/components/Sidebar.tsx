import React, { useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Video, Check, Settings } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, addDays, isToday, isTomorrow } from 'date-fns';
import { cn } from '../utils/cn';
import { CalendarEvent, CALENDARS } from '../data/mockData';

interface SidebarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEventClick: (event: CalendarEvent) => void;
  selectedCalendars: Set<string>;
  onToggleCalendar: (id: string) => void;
  onOpenSettings: () => void;
}

export function Sidebar({ currentDate, onDateChange, events, onAddEvent, onEventClick, selectedCalendars, onToggleCalendar, onOpenSettings }: SidebarProps) {
  const [calendarDate, setCalendarDate] = React.useState(currentDate);

  useEffect(() => {
    setCalendarDate(currentDate);
  }, [currentDate]);

  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => setCalendarDate(addMonths(calendarDate, 1));
  const prevMonth = () => setCalendarDate(subMonths(calendarDate, 1));

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const agendaEvents = useMemo(() => {
    const agenda = [];
    for (let i = 0; i < 5; i++) {
      const date = addDays(currentDate, i);
      const dayEvents = events
        .filter(e => isSameDay(e.start, date))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      
      if (dayEvents.length > 0 || i === 0) {
        let label = format(date, 'EEEE').toUpperCase();
        if (isToday(date) || i === 0) label = i === 0 ? 'TODAY' : label;
        if (isTomorrow(date) || i === 1) label = i === 1 ? 'TOMORROW' : label;
        
        agenda.push({
          date,
          label,
          weather: { temp: '55°/40°', icon: i % 2 === 0 ? 'sun' : 'cloud' },
          events: dayEvents.map(e => ({
            id: e.id,
            title: e.title,
            time: e.isAllDay ? 'All Day' : `${format(e.start, 'h:mm')} – ${format(e.end, 'h:mm a')}`,
            color: e.color,
            icon: e.icon,
            link: e.link,
            location: e.location,
            isAllDay: e.isAllDay || false
          }))
        });
      }
    }
    return agenda;
  }, [events, currentDate]);

  return (
    <div className="w-[300px] bg-zinc-950 text-zinc-100 flex flex-col h-full overflow-hidden shrink-0 border-r border-zinc-800">
      {/* Window Controls & Add Button */}
      <div className="flex items-center justify-between p-5 pb-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <button onClick={onAddEvent} className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors shadow-sm">
          <Plus size={16} className="text-zinc-100" />
        </button>
      </div>

      {/* Month Navigation */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          {format(calendarDate, 'MMMM')} <span className="text-zinc-500 font-normal">{format(calendarDate, 'yyyy')}</span>
        </h2>
        <div className="flex space-x-1">
          <button onClick={prevMonth} className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-100"><ChevronLeft size={18} /></button>
          <button onClick={nextMonth} className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-100"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="px-5 pb-6 border-b border-zinc-800/50">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-[11px] text-zinc-500 text-center font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 gap-x-1">
          {days.map((day, i) => {
            const isSelected = isSameDay(day, currentDate);
            const isCurrentMonth = day.getMonth() === calendarDate.getMonth();
            const isDayToday = isToday(day);
            
            return (
              <div key={i} className="flex flex-col items-center justify-center h-8">
                <button
                  onClick={() => onDateChange(day)}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    !isCurrentMonth && "text-zinc-600",
                    isCurrentMonth && !isSelected && !isDayToday && "hover:bg-zinc-800",
                    isDayToday && !isSelected && "text-accent font-bold",
                    isSelected && "bg-accent text-white shadow-sm shadow-accent/20"
                  )}
                >
                  {format(day, dateFormat)}
                </button>
                {/* Event dots */}
                <div className="flex space-x-[2px] mt-[1px] h-1">
                  {events
                    .filter(e => isSameDay(e.start, day))
                    .slice(0, 3)
                    .map((e, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "w-1 h-1 rounded-full",
                          e.color === 'blue' && "bg-blue-400",
                          e.color === 'purple' && "bg-purple-400",
                          e.color === 'orange' && "bg-orange-400",
                          e.color === 'red' && "bg-pink-400",
                          e.color === 'green' && "bg-emerald-400"
                        )}
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendars Filter */}
      <div className="px-5 py-4 border-b border-zinc-800/50">
        <h3 className="text-xs font-semibold text-zinc-500 tracking-wider mb-3 uppercase">Calendars</h3>
        <div className="space-y-2">
          {CALENDARS.map(cal => {
            const isSelected = selectedCalendars.has(cal.id);
            return (
              <label key={cal.id} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isSelected} 
                  onChange={() => onToggleCalendar(cal.id)} 
                />
                <div className={cn(
                  "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors",
                  isSelected ? (
                    cal.color === 'blue' ? "bg-blue-500 border-blue-500" :
                    cal.color === 'purple' ? "bg-purple-500 border-purple-500" :
                    cal.color === 'orange' ? "bg-orange-500 border-orange-500" :
                    cal.color === 'red' ? "bg-pink-500 border-pink-500" :
                    "bg-emerald-500 border-emerald-500"
                  ) : "border-zinc-600 group-hover:border-zinc-500 bg-transparent"
                )}>
                  {isSelected && <Check size={10} className="text-white" />}
                </div>
                <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{cal.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Agenda List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
        <h3 className="text-xs font-semibold text-zinc-500 tracking-wider mb-4 uppercase">Upcoming</h3>
        {agendaEvents.map((dayGroup, idx) => (
          <div key={idx} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline space-x-2">
                <span className={cn(
                  "text-xs font-bold tracking-wider",
                  dayGroup.label === 'TODAY' ? "text-accent" : "text-zinc-400"
                )}>
                  {dayGroup.label}
                </span>
                <span className="text-xs text-zinc-600">{format(dayGroup.date, 'M/d')}</span>
              </div>
            </div>

            <div className="space-y-3">
              {dayGroup.events.length === 0 ? (
                <div className="text-xs text-zinc-600 italic">No events</div>
              ) : (
                dayGroup.events.map((event) => (
                  <div key={event.id} className="flex flex-col cursor-pointer hover:bg-zinc-800/50 p-2 rounded-lg -mx-2 transition-colors group" onClick={() => {
                    const fullEvent = events.find(e => e.id === event.id);
                    if (fullEvent) onEventClick(fullEvent);
                  }}>
                    {event.isAllDay ? (
                      <div className={cn(
                        "text-white text-xs font-medium px-2 py-1 rounded-md inline-block w-fit mb-1",
                        event.color === 'blue' && "bg-blue-500",
                        event.color === 'purple' && "bg-purple-500",
                        event.color === 'orange' && "bg-orange-500",
                        event.color === 'red' && "bg-pink-500",
                        event.color === 'green' && "bg-emerald-500"
                      )}>
                        {event.title}
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          event.color === 'blue' && "bg-blue-400",
                          event.color === 'purple' && "bg-purple-400",
                          event.color === 'orange' && "bg-orange-400",
                          event.color === 'red' && "bg-pink-400",
                          event.color === 'green' && "bg-emerald-400"
                        )} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-200 leading-tight group-hover:text-white transition-colors">{event.title}</span>
                          <div className="flex items-center space-x-1 text-xs text-zinc-500 mt-1">
                            <span>{event.time}</span>
                            {event.icon === 'video' && <Video size={12} className="ml-1" />}
                          </div>
                          {event.location && (
                            <span className="text-xs text-zinc-500 mt-0.5 truncate">{event.location}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Settings Button */}
      <div className="p-4 border-t border-zinc-800/50 mt-auto">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
