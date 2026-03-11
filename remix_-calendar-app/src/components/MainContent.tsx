import React from 'react';
import { ChevronLeft, ChevronRight, Search, Video } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { cn } from '../utils/cn';
import { CalendarEvent } from '../data/mockData';
import { ViewMode } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

interface MainContentProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onGridClick: (date: Date, time: string) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onGridClick: (date: Date, time: string) => void;
}

interface WeekViewProps extends CalendarGridProps {
  view: ViewMode;
}

const getEventColorClasses = (color: string, isAllDay: boolean = false) => {
  if (isAllDay) {
    switch (color) {
      case 'blue': return 'bg-blue-500 text-white';
      case 'purple': return 'bg-purple-500 text-white';
      case 'orange': return 'bg-orange-500 text-white';
      case 'red': return 'bg-pink-500 text-white';
      case 'green': return 'bg-emerald-500 text-white';
      default: return 'bg-zinc-500 text-white';
    }
  }
  switch (color) {
    case 'blue': return 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
    case 'purple': return 'bg-purple-50 border-l-4 border-purple-500 text-purple-700';
    case 'orange': return 'bg-orange-50 border-l-4 border-orange-500 text-orange-700';
    case 'red': return 'bg-pink-50 border-l-4 border-pink-500 text-pink-700';
    case 'green': return 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700';
    default: return 'bg-zinc-50 border-l-4 border-zinc-400 text-zinc-700';
  }
};

function MonthView({ currentDate, events, onEventClick, onGridClick }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const rows = days.length / 7;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900">
      <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      <div 
        className="flex-1 grid grid-cols-7"
        style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
      >
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayEvents = events.filter((e: CalendarEvent) => isSameDay(e.start, day));
          
          return (
            <div 
              key={i} 
              onClick={() => onGridClick(day, '09:00')}
              className={cn(
                "border-b border-r border-zinc-200 dark:border-zinc-800 p-1 flex flex-col gap-1 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors",
                !isCurrentMonth && "bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600",
                (i + 1) % 7 === 0 && "border-r-0"
              )}
            >
              <div className="flex justify-between items-center px-1">
                <span className={cn(
                  "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mt-1",
                  isSameDay(day, new Date()) ? "bg-accent text-white" : (isCurrentMonth ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-600")
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                {dayEvents.slice(0, 4).map((event: CalendarEvent) => (
                  <div
                    key={event.id}
                    onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] font-semibold rounded-sm truncate transition-transform hover:scale-[1.02]",
                      event.isAllDay ? getEventColorClasses(event.color, true) : getEventColorClasses(event.color, false)
                    )}
                  >
                    {!event.isAllDay && <span className="mr-1 opacity-75">{format(event.start, 'h:mm')}</span>}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 4 && (
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium px-1">
                    +{dayEvents.length - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ currentDate, events, onEventClick, onGridClick, view }: WeekViewProps) {
  const weekStart = view === 'Day' ? currentDate : startOfWeek(currentDate);
  const daysCount = view === 'Day' ? 1 : 7;
  const days = Array.from({ length: daysCount }).map((_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 11 }).map((_, i) => i + 7); // 7 AM to 5 PM

  const getEventStyle = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();

    const top = ((startHour - 7) * 60 + startMinute) * (100 / 60);
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
    const height = duration * (100 / 60);

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar bg-white dark:bg-zinc-900">
      {/* Days Header */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0 sticky top-0 bg-white dark:bg-zinc-900 z-20 shadow-sm shadow-zinc-200/50 dark:shadow-zinc-900/50">
        <div className="w-16 shrink-0 border-r border-zinc-200 dark:border-zinc-800"></div>
        {days.map((day, i) => (
          <div key={i} className="flex-1 border-r border-zinc-200 dark:border-zinc-800 p-3 flex flex-col items-center">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider mb-1 uppercase">{format(day, 'EEE')}</span>
            <span className={cn(
              "text-2xl font-semibold w-10 h-10 flex items-center justify-center rounded-full",
              isSameDay(day, new Date()) ? "bg-accent text-white" : "text-zinc-900 dark:text-zinc-100"
            )}>
              {format(day, 'd')}
            </span>
          </div>
        ))}
        <div className="w-4 shrink-0"></div>
      </div>

      {/* Time Grid */}
      <div className="flex-1 flex relative">
        {/* Time Labels */}
        <div className="w-16 shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900 z-10">
          {hours.map(hour => (
            <div key={hour} className="h-[100px] border-b border-zinc-100 dark:border-zinc-800/50 relative">
              <span className="absolute -top-2.5 right-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </span>
            </div>
          ))}
        </div>

        {/* Day Columns */}
        <div className="flex-1 flex">
          {days.map((day, dayIdx) => {
            const dayEvents = events.filter((e: CalendarEvent) => isSameDay(e.start, day));
            
            const now = new Date();
            const isToday = isSameDay(day, now);
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const showTimeLine = isToday && currentHour >= 7 && currentHour <= 17;
            const timeLineTop = showTimeLine ? (currentHour - 7) * 100 + (currentMinute / 60) * 100 : 0;
            
            return (
              <div key={dayIdx} className="flex-1 border-r border-zinc-200 dark:border-zinc-800 relative">
                {/* Grid Lines & Clickable Cells */}
                {hours.map(hour => (
                  <div 
                    key={hour} 
                    onClick={() => onGridClick(day, `${String(hour).padStart(2, '0')}:00`)}
                    className="h-[100px] border-b border-zinc-100 dark:border-zinc-800/50 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors" 
                  />
                ))}

                {/* Current Time Line */}
                {showTimeLine && (
                  <div
                    className="absolute w-full flex items-center z-20 pointer-events-none"
                    style={{ top: `${timeLineTop}px`, transform: 'translateY(-50%)' }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-accent -ml-[5px]" />
                    <div className="flex-1 border-t-2 border-accent" />
                  </div>
                )}

                {/* All-Day Events */}
                <div className="absolute top-0 left-0 right-0 z-30 flex flex-col gap-1 p-1">
                  {dayEvents.filter((e: CalendarEvent) => e.isAllDay).map((event: CalendarEvent) => (
                    <div
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      className={cn(
                        "rounded-sm px-2 py-1 text-xs font-semibold truncate cursor-pointer shadow-sm transition-transform hover:scale-[1.02]",
                        getEventColorClasses(event.color, true)
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>

                {/* Regular Events */}
                {dayEvents.filter((e: CalendarEvent) => !e.isAllDay).map((event: CalendarEvent) => {
                  const overlappingEvents = dayEvents.filter((e: CalendarEvent) => 
                    !e.isAllDay && (
                      (e.start >= event.start && e.start < event.end) || 
                      (e.end > event.start && e.end <= event.end) ||
                      (e.start <= event.start && e.end >= event.end)
                    )
                  );
                  
                  const isOverlapping = overlappingEvents.length > 1;
                  const overlapIndex = overlappingEvents.findIndex((e: CalendarEvent) => e.id === event.id);
                  const style = getEventStyle(event);
                  
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      className={cn(
                        "absolute rounded-md p-2 overflow-hidden transition-all hover:z-10 hover:shadow-md cursor-pointer",
                        getEventColorClasses(event.color, false),
                        isOverlapping ? (overlapIndex === 0 ? "left-1 right-[51%]" : "left-[51%] right-1") : "left-1 right-1"
                      )}
                      style={style}
                    >
                      <div className="flex items-start space-x-1">
                        <span className="text-xs font-semibold whitespace-nowrap">
                          {format(event.start, 'h:mm a')}
                        </span>
                        {event.icon === 'video' ? <Video size={12} className="mt-0.5 shrink-0" /> : <span className="text-xs">{event.icon}</span>}
                      </div>
                      <div className="text-xs font-semibold leading-tight mt-0.5 line-clamp-2">
                        {event.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="w-4 shrink-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800"></div>
      </div>
    </div>
  );
}

export function MainContent({ currentDate, onDateChange, events, onEventClick, onGridClick, view, onViewChange, searchQuery, onSearchChange }: MainContentProps) {
  const nextPeriod = () => {
    if (view === 'Month') onDateChange(addMonths(currentDate, 1));
    else if (view === 'Week') onDateChange(addWeeks(currentDate, 1));
    else onDateChange(addDays(currentDate, 1));
  };

  const prevPeriod = () => {
    if (view === 'Month') onDateChange(subMonths(currentDate, 1));
    else if (view === 'Week') onDateChange(subWeeks(currentDate, 1));
    else onDateChange(addDays(currentDate, -1));
  };

  const goToday = () => onDateChange(new Date());

  const getHeaderLabel = () => {
    if (view === 'Month') return format(currentDate, 'MMMM yyyy');
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    if (isSameMonth(weekStart, weekEnd)) {
      return `${format(weekStart, 'MMMM yyyy')}`;
    }
    return `${format(weekStart, 'MMM')} - ${format(weekEnd, 'MMM yyyy')}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-zinc-900">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 min-w-[180px]">
            {getHeaderLabel()}
          </h1>
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg p-1 border border-zinc-200/50 dark:border-zinc-700/50">
            <button onClick={prevPeriod} className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 transition-all shadow-sm hover:shadow dark:shadow-none"><ChevronLeft size={16} /></button>
            <button onClick={goToday} className="px-4 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all shadow-sm hover:shadow dark:shadow-none mx-1">Today</button>
            <button onClick={nextPeriod} className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 transition-all shadow-sm hover:shadow dark:shadow-none"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg p-1 border border-zinc-200/50 dark:border-zinc-700/50">
          {['Day', 'Week', 'Month'].map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v as ViewMode)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                view === v ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search events"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg text-sm focus:bg-white dark:focus:bg-zinc-900 focus:border-accent focus:ring-2 focus:ring-accent/20 w-64 transition-all outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Calendar Content with Animation */}
      <div className="flex-1 relative overflow-hidden bg-transparent p-4">
        <div className="absolute inset-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${view}-${currentDate.toISOString()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full"
            >
              {view === 'Month' ? (
                <MonthView currentDate={currentDate} events={events} onEventClick={onEventClick} onGridClick={onGridClick} />
              ) : (
                <WeekView currentDate={currentDate} events={events} onEventClick={onEventClick} onGridClick={onGridClick} view={view} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
