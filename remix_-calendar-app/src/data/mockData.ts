import { addDays, startOfWeek, setHours, setMinutes } from 'date-fns';

export type EventColor = 'blue' | 'purple' | 'orange' | 'red' | 'green';

export interface Calendar {
  id: string;
  name: string;
  color: EventColor;
}

export const CALENDARS: Calendar[] = [
  { id: 'cal1', name: 'Work', color: 'blue' },
  { id: 'cal2', name: 'Personal', color: 'purple' },
  { id: 'cal3', name: 'Family', color: 'orange' },
];

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: EventColor;
  icon?: string;
  link?: string;
  description?: string;
  location?: string;
  isAllDay?: boolean;
  calendarId: string;
}

// Anchor demo data to the current week so the imported view never opens blank.
const baseDate = startOfWeek(new Date(), { weekStartsOn: 0 });

export const mockEvents: CalendarEvent[] = [
  // Monday 22nd
  {
    id: '1',
    title: 'Monday Wake-Up Hour',
    start: setHours(setMinutes(addDays(baseDate, 1), 0), 8),
    end: setHours(setMinutes(addDays(baseDate, 1), 0), 9),
    color: 'blue',
    icon: 'video',
    calendarId: 'cal1',
  },
  {
    id: '2',
    title: 'All-Team Kickoff',
    start: setHours(setMinutes(addDays(baseDate, 1), 0), 9),
    end: setHours(setMinutes(addDays(baseDate, 1), 0), 10),
    color: 'blue',
    calendarId: 'cal1',
  },
  {
    id: '3',
    title: 'Financial Update',
    start: setHours(setMinutes(addDays(baseDate, 1), 0), 10),
    end: setHours(setMinutes(addDays(baseDate, 1), 0), 11),
    color: 'blue',
    icon: 'video',
    calendarId: 'cal1',
  },
  {
    id: '4',
    title: 'New Employee Welcome Lunch!',
    start: setHours(setMinutes(addDays(baseDate, 1), 0), 11),
    end: setHours(setMinutes(addDays(baseDate, 1), 0), 12),
    color: 'purple',
    icon: '🍔',
    calendarId: 'cal1',
  },
  {
    id: '5',
    title: 'Design Review',
    start: setHours(setMinutes(addDays(baseDate, 1), 0), 13),
    end: setHours(setMinutes(addDays(baseDate, 1), 0), 14),
    color: 'blue',
    icon: 'video',
    calendarId: 'cal1',
  },
  {
    id: '6',
    title: '1:1 with Jon',
    start: setHours(setMinutes(addDays(baseDate, 1), 0), 14),
    end: setHours(setMinutes(addDays(baseDate, 1), 0), 15),
    color: 'orange',
    icon: 'video',
    calendarId: 'cal1',
  },

  // Tuesday 23rd
  {
    id: '7',
    title: 'Design Review: Acme Marketi...',
    start: setHours(setMinutes(addDays(baseDate, 2), 0), 9),
    end: setHours(setMinutes(addDays(baseDate, 2), 0), 10),
    color: 'blue',
    calendarId: 'cal1',
  },
  {
    id: '8',
    title: 'Webinar: Figma ...',
    start: setHours(setMinutes(addDays(baseDate, 2), 0), 9),
    end: setHours(setMinutes(addDays(baseDate, 2), 0), 10),
    color: 'green',
    calendarId: 'cal1',
  },
  {
    id: '9',
    title: 'Design System Kickoff Lunch',
    start: setHours(setMinutes(addDays(baseDate, 2), 0), 12),
    end: setHours(setMinutes(addDays(baseDate, 2), 0), 13),
    color: 'blue',
    icon: '🍔',
    calendarId: 'cal1',
  },
  {
    id: '10',
    title: 'Concept Design Review II',
    start: setHours(setMinutes(addDays(baseDate, 2), 0), 14),
    end: setHours(setMinutes(addDays(baseDate, 2), 0), 15),
    color: 'blue',
    icon: 'video',
    calendarId: 'cal1',
  },
  {
    id: '11',
    title: 'Design Team Happy Hour',
    start: setHours(setMinutes(addDays(baseDate, 2), 0), 16),
    end: setHours(setMinutes(addDays(baseDate, 2), 0), 17),
    color: 'red',
    icon: '🍷',
    calendarId: 'cal1',
  },

  // Wednesday 24th
  {
    id: '12',
    title: 'Coffee Chat',
    start: setHours(setMinutes(addDays(baseDate, 3), 0), 9),
    end: setHours(setMinutes(addDays(baseDate, 3), 0), 10),
    color: 'blue',
    icon: '☕',
    calendarId: 'cal1',
  },
  {
    id: '13',
    title: 'Onboarding Presentation',
    start: setHours(setMinutes(addDays(baseDate, 3), 0), 11),
    end: setHours(setMinutes(addDays(baseDate, 3), 0), 12),
    color: 'purple',
    icon: 'video',
    calendarId: 'cal1',
  },
  {
    id: '14',
    title: 'MVP Prioritization Workshop',
    start: setHours(setMinutes(addDays(baseDate, 3), 0), 13),
    end: setHours(setMinutes(addDays(baseDate, 3), 0), 14),
    color: 'blue',
    icon: 'video',
    calendarId: 'cal1',
  },

  // Thursday 25th
  {
    id: '15',
    title: 'Health Benefits Walkthrough',
    start: setHours(setMinutes(addDays(baseDate, 4), 0), 10),
    end: setHours(setMinutes(addDays(baseDate, 4), 0), 11),
    color: 'purple',
    icon: 'video',
    calendarId: 'cal1',
  },
  {
    id: '16',
    title: 'Design Review',
    start: setHours(setMinutes(addDays(baseDate, 4), 0), 13),
    end: setHours(setMinutes(addDays(baseDate, 4), 0), 14),
    color: 'blue',
    icon: 'video',
    calendarId: 'cal1',
  },

  // Friday 26th
  {
    id: '17',
    title: 'Coffee Chat',
    start: setHours(setMinutes(addDays(baseDate, 5), 0), 9),
    end: setHours(setMinutes(addDays(baseDate, 5), 0), 10),
    color: 'blue',
    icon: '☕',
    calendarId: 'cal1',
  },
  {
    id: '18',
    title: 'Marketing Meet-and-Greet',
    start: setHours(setMinutes(addDays(baseDate, 5), 0), 12),
    end: setHours(setMinutes(addDays(baseDate, 5), 0), 13),
    color: 'blue',
    icon: '🥗',
    calendarId: 'cal1',
  },
  {
    id: '19',
    title: '1:1 with Heather',
    start: setHours(setMinutes(addDays(baseDate, 5), 0), 14),
    end: setHours(setMinutes(addDays(baseDate, 5), 0), 15),
    color: 'orange',
    icon: 'video',
    calendarId: 'cal1',
  },
  {
    id: '20',
    title: 'Happy Hour',
    start: setHours(setMinutes(addDays(baseDate, 5), 0), 16),
    end: setHours(setMinutes(addDays(baseDate, 5), 0), 17),
    color: 'red',
    icon: '🍷',
    calendarId: 'cal1',
  },
];
