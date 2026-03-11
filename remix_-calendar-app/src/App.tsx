import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { EventModal } from './components/EventModal';
import { SettingsModal } from './components/SettingsModal';
import { mockEvents, CalendarEvent, CALENDARS } from './data/mockData';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

export type ViewMode = 'Day' | 'Week' | 'Month';

const ACCENT_STYLES = {
  blue: { base: '#3b82f6', light: '#eff6ff', darkLight: '#1e3a8a', text: '#1d4ed8', darkText: '#93c5fd' },
  purple: { base: '#a855f7', light: '#faf5ff', darkLight: '#581c87', text: '#7e22ce', darkText: '#d8b4fe' },
  emerald: { base: '#10b981', light: '#ecfdf5', darkLight: '#064e3b', text: '#047857', darkText: '#6ee7b7' },
  rose: { base: '#f43f5e', light: '#fff1f2', darkLight: '#881337', text: '#be123c', darkText: '#fda4af' },
  amber: { base: '#f59e0b', light: '#fffbeb', darkLight: '#78350f', text: '#b45309', darkText: '#fcd34d' },
} as const;

const createEventId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

function AppContent() {
  const { mode, accent, backgroundImage } = useTheme();
  const [currentDate, setCurrentDate] = useState(() => mockEvents[0]?.start ?? new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [view, setView] = useState<ViewMode>('Week');
  const [selectedCalendars, setSelectedCalendars] = useState<Set<string>>(
    new Set(CALENDARS.map(c => c.id))
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return events.filter(e => {
      const matchesCalendar = selectedCalendars.has(e.calendarId);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        e.title.toLowerCase().includes(normalizedQuery) ||
        (e.description && e.description.toLowerCase().includes(normalizedQuery)) ||
        (e.location && e.location.toLowerCase().includes(normalizedQuery));
      return matchesCalendar && matchesSearch;
    });
  }, [events, selectedCalendars, searchQuery]);

  const handleToggleCalendar = (id: string) => {
    setSelectedCalendars((currentCalendars) => {
      const next = new Set(currentCalendars);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setSelectedTime(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedTime(null);
    setIsModalOpen(true);
  };

  const handleGridClick = (date: Date, time: string) => {
    setCurrentDate(date);
    setSelectedEvent(null);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'> | CalendarEvent) => {
    if ('id' in eventData && eventData.id) {
      setEvents((currentEvents) =>
        currentEvents.map((existingEvent) =>
          existingEvent.id === eventData.id ? (eventData as CalendarEvent) : existingEvent,
        ),
      );
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: createEventId(),
      };
      setEvents((currentEvents) => [...currentEvents, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== id));
  };

  const accentStyle = ACCENT_STYLES[accent];

  return (
    <div
      className={`flex h-screen w-full overflow-hidden font-sans text-zinc-900 relative ${mode === 'dark' ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-50'}`}
      style={
        {
          '--color-accent': accentStyle.base,
          '--color-accent-light': mode === 'dark' ? accentStyle.darkLight : accentStyle.light,
          '--color-accent-text': mode === 'dark' ? accentStyle.darkText : accentStyle.text,
        } as React.CSSProperties
      }
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div className="flex h-full w-full z-10 relative">
        <Sidebar 
          currentDate={currentDate} 
          onDateChange={setCurrentDate} 
          events={filteredEvents}
          onAddEvent={handleAddEvent}
          onEventClick={handleEventClick}
          selectedCalendars={selectedCalendars}
          onToggleCalendar={handleToggleCalendar}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <MainContent 
          currentDate={currentDate} 
          onDateChange={setCurrentDate} 
          events={filteredEvents}
          onEventClick={handleEventClick}
          onGridClick={handleGridClick}
          view={view}
          onViewChange={setView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        selectedDate={currentDate}
        selectedTime={selectedTime}
      />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
