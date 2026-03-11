import React, { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, MapPin, Palette, Trash2, Folder } from 'lucide-react';
import { CalendarEvent, EventColor, CALENDARS } from '../data/mockData';
import { addHours, format, parse } from 'date-fns';
import { cn } from '../utils/cn';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent | null;
  selectedDate?: Date;
  selectedTime?: string | null;
}

const COLORS: { value: EventColor; hex: string; label: string }[] = [
  { value: 'blue', hex: '#3b82f6', label: 'Blue' },
  { value: 'purple', hex: '#a855f7', label: 'Purple' },
  { value: 'orange', hex: '#f97316', label: 'Orange' },
  { value: 'red', hex: '#ec4899', label: 'Red' },
  { value: 'green', hex: '#10b981', label: 'Green' },
];

export function EventModal({ isOpen, onClose, onSave, onDelete, event, selectedDate, selectedTime }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<EventColor>('blue');
  const [calendarId, setCalendarId] = useState<string>(CALENDARS[0].id);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(format(event.start, 'yyyy-MM-dd'));
      setStartTime(format(event.start, 'HH:mm'));
      setEndTime(format(event.end, 'HH:mm'));
      setIsAllDay(event.isAllDay || false);
      setLocation(event.location || '');
      setDescription(event.description || '');
      setColor(event.color);
      setCalendarId(event.calendarId);
    } else {
      setTitle('');
      setDate(format(selectedDate || new Date(), 'yyyy-MM-dd'));
      
      const st = selectedTime || '09:00';
      setStartTime(st);
      
      const [h, m] = st.split(':');
      const endH = String((parseInt(h) + 1) % 24).padStart(2, '0');
      setEndTime(`${endH}:${m}`);
      
      setIsAllDay(false);
      setLocation('');
      setDescription('');
      setColor('blue');
      setCalendarId(CALENDARS[0].id);
    }
  }, [event, selectedDate, selectedTime, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = isAllDay 
      ? parse(`${date} 00:00`, 'yyyy-MM-dd HH:mm', new Date())
      : parse(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
      
    const parsedEnd = isAllDay
      ? parse(`${date} 23:59`, 'yyyy-MM-dd HH:mm', new Date())
      : parse(`${date} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const end = !isAllDay && parsedEnd <= start ? addHours(start, 1) : parsedEnd;
    
    onSave({
      ...(event ? { id: event.id } : {}),
      title: title || 'Untitled Event',
      start,
      end,
      color,
      description,
      location,
      isAllDay,
      calendarId,
    } as CalendarEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">{event ? 'Edit Event' : 'New Event'}</h2>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <input 
              autoFocus
              type="text" 
              placeholder="Event title"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full text-2xl font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 border-0 border-b-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-accent focus:ring-0 px-0 py-2 transition-colors bg-transparent" 
            />
          </div>

          <div className="space-y-5">
            {/* Date & Time Row */}
            <div className="flex items-start space-x-4">
              <Clock className="w-5 h-5 text-zinc-400 mt-2.5 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">All-day</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isAllDay} onChange={e => setIsAllDay(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input 
                    required 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 transition-colors" 
                  />
                  {!isAllDay && (
                    <>
                      <input 
                        required 
                        type="time" 
                        value={startTime} 
                        onChange={e => setStartTime(e.target.value)} 
                        className="w-32 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5 transition-colors" 
                      />
                      <span className="text-zinc-400">-</span>
                      <input 
                        required 
                        type="time" 
                        value={endTime} 
                        onChange={e => setEndTime(e.target.value)} 
                        className="w-32 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5 transition-colors" 
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar Row */}
            <div className="flex items-center space-x-4">
              <Folder className="w-5 h-5 text-zinc-400 shrink-0" />
              <select
                value={calendarId}
                onChange={e => setCalendarId(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 transition-colors"
              >
                {CALENDARS.map(cal => (
                  <option key={cal.id} value={cal.id}>{cal.name}</option>
                ))}
              </select>
            </div>

            {/* Location Row */}
            <div className="flex items-center space-x-4">
              <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Add location"
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                className="flex-1 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-accent focus:ring-0 px-0 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-colors" 
              />
            </div>

            {/* Description Row */}
            <div className="flex items-start space-x-4">
              <AlignLeft className="w-5 h-5 text-zinc-400 mt-2.5 shrink-0" />
              <textarea 
                placeholder="Add description"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={3}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-3 transition-colors resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
              />
            </div>

            {/* Color Row */}
            <div className="flex items-center space-x-4">
              <Palette className="w-5 h-5 text-zinc-400 shrink-0" />
              <div className="flex space-x-3">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                      color === c.value && "ring-2 ring-offset-2 ring-zinc-400 dark:ring-offset-zinc-900"
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.value && <div className="w-2 h-2 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            {event && onDelete ? (
              <button 
                type="button" 
                onClick={() => { onDelete(event.id); onClose(); }} 
                className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            ) : (
              <div /> // Spacer
            )}
            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
