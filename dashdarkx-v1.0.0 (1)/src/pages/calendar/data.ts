import { addDays, setHours, setMinutes, startOfWeek } from 'date-fns';

export interface CalendarCategory {
  id: string;
  name: string;
  color: 'primary' | 'secondary' | 'warning' | 'error';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: string;
  location?: string;
  description?: string;
  isAllDay?: boolean;
}

const currentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });

const atTime = (date: Date, hour: number, minute = 0) =>
  setHours(setMinutes(date, minute), hour);

export const CALENDAR_CATEGORIES: CalendarCategory[] = [
  { id: 'dispatch', name: 'Dispatch', color: 'primary' },
  { id: 'drivers', name: 'Drivers', color: 'secondary' },
  { id: 'maintenance', name: 'Maintenance', color: 'warning' },
  { id: 'compliance', name: 'Compliance', color: 'error' },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Morning dispatch board',
    start: atTime(addDays(currentWeek, 1), 7, 30),
    end: atTime(addDays(currentWeek, 1), 8, 15),
    calendarId: 'dispatch',
    location: 'Ops floor',
    description: 'Review late loads, driver gaps, and high-risk ETAs.',
  },
  {
    id: 'evt-2',
    title: 'Driver handoff window',
    start: atTime(addDays(currentWeek, 1), 9, 0),
    end: atTime(addDays(currentWeek, 1), 10, 30),
    calendarId: 'drivers',
    location: 'Yard lane 3',
  },
  {
    id: 'evt-3',
    title: 'Preventive maintenance block',
    start: atTime(addDays(currentWeek, 2), 11, 0),
    end: atTime(addDays(currentWeek, 2), 13, 0),
    calendarId: 'maintenance',
    location: 'Bay 2',
  },
  {
    id: 'evt-4',
    title: 'Insurance renewal cutoff',
    start: atTime(addDays(currentWeek, 2), 0, 0),
    end: atTime(addDays(currentWeek, 2), 23, 59),
    calendarId: 'compliance',
    isAllDay: true,
    description: 'Submit renewal packet before the carrier portal locks.',
  },
  {
    id: 'evt-5',
    title: 'Broker review',
    start: atTime(addDays(currentWeek, 3), 14, 0),
    end: atTime(addDays(currentWeek, 3), 15, 0),
    calendarId: 'dispatch',
    location: 'Conference room',
  },
  {
    id: 'evt-6',
    title: 'Driver qualification file audit',
    start: atTime(addDays(currentWeek, 4), 10, 0),
    end: atTime(addDays(currentWeek, 4), 11, 30),
    calendarId: 'compliance',
    location: 'Back office',
  },
  {
    id: 'evt-7',
    title: 'Fuel card exception review',
    start: atTime(addDays(currentWeek, 5), 8, 30),
    end: atTime(addDays(currentWeek, 5), 9, 30),
    calendarId: 'dispatch',
  },
  {
    id: 'evt-8',
    title: 'Weekend tractor release',
    start: atTime(addDays(currentWeek, 6), 12, 0),
    end: atTime(addDays(currentWeek, 6), 14, 0),
    calendarId: 'maintenance',
    location: 'South lot',
  },
];
