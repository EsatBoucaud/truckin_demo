import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  max,
  parse,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import {
  CALENDAR_CATEGORIES,
  CalendarCategory,
  CalendarEvent,
  INITIAL_CALENDAR_EVENTS,
} from './data';

type ViewMode = 'day' | 'week' | 'month';

const STORAGE_KEY = 'truckin.calendar.events.v1';
const START_HOUR = 6;
const END_HOUR = 20;
const HOUR_ROW_HEIGHT = 72;

interface EventDraft {
  id?: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarId: string;
  location: string;
  description: string;
  isAllDay: boolean;
}

const buildEventId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `evt-${Math.random().toString(36).slice(2, 11)}`;

const deserializeEvents = (): CalendarEvent[] => {
  if (typeof window === 'undefined') {
    return INITIAL_CALENDAR_EVENTS;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return INITIAL_CALENDAR_EVENTS;
  }

  try {
    const parsed = JSON.parse(raw) as Array<
      Omit<CalendarEvent, 'start' | 'end'> & { start: string; end: string }
    >;
    return parsed.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  } catch {
    return INITIAL_CALENDAR_EVENTS;
  }
};

const serializeEvents = (events: CalendarEvent[]) =>
  JSON.stringify(
    events.map((event) => ({
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    })),
  );

const getCategory = (categoryId: string) =>
  CALENDAR_CATEGORIES.find((category) => category.id === categoryId) ?? CALENDAR_CATEGORIES[0];

const eventTouchesDay = (event: CalendarEvent, day: Date) =>
  startOfDay(event.end).getTime() >= startOfDay(day).getTime() &&
  startOfDay(event.start).getTime() <= startOfDay(day).getTime();

const formatViewLabel = (date: Date, view: ViewMode) => {
  if (view === 'month') {
    return format(date, 'MMMM yyyy');
  }

  if (view === 'day') {
    return format(date, 'EEEE, MMMM d');
  }

  const rangeStart = startOfWeek(date, { weekStartsOn: 0 });
  const rangeEnd = endOfWeek(date, { weekStartsOn: 0 });
  return `${format(rangeStart, 'MMM d')} - ${format(rangeEnd, 'MMM d, yyyy')}`;
};

const buildDraft = (event?: CalendarEvent | null, selectedDate?: Date): EventDraft => {
  if (event) {
    return {
      id: event.id,
      title: event.title,
      date: format(event.start, 'yyyy-MM-dd'),
      startTime: format(event.start, 'HH:mm'),
      endTime: format(event.end, 'HH:mm'),
      calendarId: event.calendarId,
      location: event.location ?? '',
      description: event.description ?? '',
      isAllDay: Boolean(event.isAllDay),
    };
  }

  const baseDate = selectedDate ?? new Date();
  const roundedHour = Math.max(baseDate.getHours(), START_HOUR);
  const start = setMinutes(setHours(baseDate, roundedHour), 0);
  const end = setHours(start, start.getHours() + 1);

  return {
    title: '',
    date: format(baseDate, 'yyyy-MM-dd'),
    startTime: format(start, 'HH:mm'),
    endTime: format(end, 'HH:mm'),
    calendarId: CALENDAR_CATEGORIES[0].id,
    location: '',
    description: '',
    isAllDay: false,
  };
};

const getEventBlockMetrics = (event: CalendarEvent) => {
  if (event.isAllDay) {
    return { top: 8, height: 28 };
  }

  const startMinutes = (event.start.getHours() - START_HOUR) * 60 + event.start.getMinutes();
  const durationMinutes = Math.max((event.end.getTime() - event.start.getTime()) / 60000, 30);

  return {
    top: (startMinutes / 60) * HOUR_ROW_HEIGHT,
    height: Math.max((durationMinutes / 60) * HOUR_ROW_HEIGHT, 36),
  };
};

const CalendarPage = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>(() => deserializeEvents());
  const [currentDate, setCurrentDate] = useState<Date>(() => deserializeEvents()[0]?.start ?? new Date());
  const [view, setView] = useState<ViewMode>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendars, setSelectedCalendars] = useState<Set<string>>(
    () => new Set(CALENDAR_CATEGORIES.map((category) => category.id)),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [draft, setDraft] = useState<EventDraft>(() => buildDraft());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, serializeEvents(events));
    }
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return events
      .filter((event) => selectedCalendars.has(event.calendarId))
      .filter((event) => {
        if (!normalizedQuery) {
          return true;
        }

        return [event.title, event.location, event.description]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));
      })
      .sort((left, right) => left.start.getTime() - right.start.getTime());
  }, [events, searchQuery, selectedCalendars]);

  const visibleDays = useMemo(() => {
    if (view === 'day') {
      return [currentDate];
    }

    if (view === 'week') {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 0 }),
        end: endOfWeek(currentDate, { weekStartsOn: 0 }),
      });
    }

    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }),
      end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 }),
    });
  }, [currentDate, view]);

  const agendaEvents = useMemo(() => {
    return eachDayOfInterval({
      start: currentDate,
      end: addDays(currentDate, 4),
    }).map((day) => ({
      day,
      events: filteredEvents.filter((event) => eventTouchesDay(event, day)),
    }));
  }, [currentDate, filteredEvents]);

  const openCreateDialog = (date = currentDate) => {
    setEditingEvent(null);
    setDraft(buildDraft(null, date));
    setDialogOpen(true);
  };

  const openEditDialog = (event: CalendarEvent) => {
    setEditingEvent(event);
    setDraft(buildDraft(event));
    setDialogOpen(true);
  };

  const handleSaveEvent = (submittedDraft: EventDraft) => {
    const start = submittedDraft.isAllDay
      ? parse(`${submittedDraft.date} 00:00`, 'yyyy-MM-dd HH:mm', new Date())
      : parse(`${submittedDraft.date} ${submittedDraft.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const parsedEnd = submittedDraft.isAllDay
      ? parse(`${submittedDraft.date} 23:59`, 'yyyy-MM-dd HH:mm', new Date())
      : parse(`${submittedDraft.date} ${submittedDraft.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const safeEnd = submittedDraft.isAllDay
      ? parsedEnd
      : max([parsedEnd, setHours(start, start.getHours() + 1)]);

    const nextEvent: CalendarEvent = {
      id: submittedDraft.id ?? buildEventId(),
      title: submittedDraft.title.trim() || 'Untitled event',
      start,
      end: safeEnd,
      calendarId: submittedDraft.calendarId,
      location: submittedDraft.location.trim() || undefined,
      description: submittedDraft.description.trim() || undefined,
      isAllDay: submittedDraft.isAllDay,
    };

    setEvents((currentEvents) => {
      const exists = currentEvents.some((event) => event.id === nextEvent.id);
      return exists
        ? currentEvents.map((event) => (event.id === nextEvent.id ? nextEvent : event))
        : [...currentEvents, nextEvent];
    });

    setCurrentDate(nextEvent.start);
    setDialogOpen(false);
  };

  const handleDeleteEvent = () => {
    if (!editingEvent) {
      return;
    }

    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== editingEvent.id));
    setDialogOpen(false);
  };

  const movePeriod = (direction: 'next' | 'previous') => {
    const factor = direction === 'next' ? 1 : -1;
    if (view === 'month') {
      setCurrentDate((value) => (factor > 0 ? addMonths(value, 1) : subMonths(value, 1)));
      return;
    }

    if (view === 'week') {
      setCurrentDate((value) => (factor > 0 ? addWeeks(value, 1) : subWeeks(value, 1)));
      return;
    }

    setCurrentDate((value) => addDays(value, factor));
  };

  const viewLabel = formatViewLabel(currentDate, view);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} xl={3.2}>
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">Calendar</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dispatch schedules, maintenance blocks, and compliance deadlines.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<IconifyIcon icon="mingcute:add-line" />}
                  onClick={() => openCreateDialog(currentDate)}
                >
                  Event
                </Button>
              </Stack>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={dayjs(currentDate)}
                  onChange={(value) => {
                    if (value) {
                      setCurrentDate(value.toDate());
                    }
                  }}
                  sx={{
                    bgcolor: 'info.dark',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'neutral.darker',
                    px: 1,
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Calendars</Typography>
              {CALENDAR_CATEGORIES.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={selectedCalendars.has(category.id)}
                      onChange={() =>
                        setSelectedCalendars((currentSelection) => {
                          const nextSelection = new Set(currentSelection);
                          if (nextSelection.has(category.id)) {
                            nextSelection.delete(category.id);
                          } else {
                            nextSelection.add(category.id);
                          }
                          return nextSelection;
                        })
                      }
                    />
                  }
                  label={category.name}
                  sx={{
                    m: 0,
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'neutral.darker',
                    bgcolor: alpha(theme.palette[category.color].main, 0.08),
                  }}
                />
              ))}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Upcoming</Typography>
              <List disablePadding sx={{ display: 'grid', gap: 1.5 }}>
                {agendaEvents.map(({ day, events: dayEvents }) => (
                  <Box
                    key={day.toISOString()}
                    sx={{
                      border: 1,
                      borderColor: 'neutral.darker',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      bgcolor: 'info.main',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1.25}>
                      <Typography variant="subtitle2">{isToday(day) ? 'Today' : format(day, 'EEEE')}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(day, 'MMM d')}
                      </Typography>
                    </Stack>

                    {dayEvents.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No scheduled work.
                      </Typography>
                    ) : (
                      dayEvents.slice(0, 3).map((event) => {
                        const category = getCategory(event.calendarId);
                        return (
                          <Box
                            key={event.id}
                            onClick={() => openEditDialog(event)}
                            sx={{
                              cursor: 'pointer',
                              py: 0.75,
                              '&:not(:last-of-type)': {
                                borderBottom: 1,
                                borderColor: 'neutral.darker',
                              },
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center" mb={0.25}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: `${category.color}.main`,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography variant="subtitle2">{event.title}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                              {event.isAllDay
                                ? 'All day'
                                : `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`}
                            </Typography>
                          </Box>
                        );
                      })
                    )}
                  </Box>
                ))}
              </List>
            </Stack>
          </Paper>
        </Stack>
      </Grid>

      <Grid item xs={12} xl={8.8}>
        <Paper sx={{ p: 3, minHeight: 720 }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <Stack spacing={1}>
                <Typography variant="h5">{viewLabel}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Embedded calendar view inside the main Truckin shell. No standalone theme or app-level side effects.
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => movePeriod('previous')}>
                    <IconifyIcon icon="mingcute:left-line" />
                  </IconButton>
                  <Button variant="outlined" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <IconButton onClick={() => movePeriod('next')}>
                    <IconifyIcon icon="mingcute:right-line" />
                  </IconButton>
                </Stack>

                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={view}
                  onChange={(_, value: ViewMode | null) => {
                    if (value) {
                      setView(value);
                    }
                  }}
                >
                  <ToggleButton value="day">Day</ToggleButton>
                  <ToggleButton value="week">Week</ToggleButton>
                  <ToggleButton value="month">Month</ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search events"
                  size="small"
                  sx={{ minWidth: { xs: '100%', sm: 240 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon icon="mingcute:search-line" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            {view === 'month' ? (
              <MonthView
                currentDate={currentDate}
                days={visibleDays}
                events={filteredEvents}
                onCreate={openCreateDialog}
                onEdit={openEditDialog}
              />
            ) : (
              <WeekView
                days={visibleDays}
                events={filteredEvents}
                onCreate={openCreateDialog}
                onEdit={openEditDialog}
              />
            )}
          </Stack>
        </Paper>
      </Grid>

      <EventDialog
        categories={CALENDAR_CATEGORIES}
        draft={draft}
        editingEvent={editingEvent}
        onChange={setDraft}
        onClose={() => setDialogOpen(false)}
        onDelete={handleDeleteEvent}
        onSave={handleSaveEvent}
        open={dialogOpen}
      />
    </Grid>
  );
};

interface MonthViewProps {
  currentDate: Date;
  days: Date[];
  events: CalendarEvent[];
  onCreate: (date: Date) => void;
  onEdit: (event: CalendarEvent) => void;
}

const MonthView = ({ currentDate, days, events, onCreate, onEdit }: MonthViewProps) => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          border: 1,
          borderColor: 'neutral.darker',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
          <Box
            key={label}
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: 'info.dark',
              borderBottom: 1,
              borderColor: 'neutral.darker',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}

        {days.map((day) => {
          const dayEvents = events.filter((event) => eventTouchesDay(event, day)).slice(0, 3);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <Box
              key={day.toISOString()}
              onClick={() => onCreate(day)}
              sx={{
                minHeight: 160,
                p: 1.5,
                borderBottom: 1,
                borderRight: 1,
                borderColor: 'neutral.darker',
                bgcolor: isCurrentMonth ? 'info.main' : alpha(theme.palette.info.dark, 0.7),
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  bgcolor: isCurrentDay ? 'primary.main' : 'transparent',
                  color: isCurrentDay ? 'info.darker' : isCurrentMonth ? 'text.primary' : 'text.secondary',
                }}
              >
                <Typography variant="subtitle2">{format(day, 'd')}</Typography>
              </Box>

              <Stack spacing={1} mt={1.5}>
                {dayEvents.map((event) => {
                  const category = getCategory(event.calendarId);
                  return (
                    <Box
                      key={event.id}
                      onClick={(entryEvent) => {
                        entryEvent.stopPropagation();
                        onEdit(event);
                      }}
                      sx={{
                        px: 1,
                        py: 0.75,
                        borderLeft: 3,
                        borderColor: `${category.color}.main`,
                        bgcolor: alpha(theme.palette[category.color].main, 0.12),
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" display="block" color="text.secondary">
                        {event.isAllDay ? 'All day' : format(event.start, 'h:mm a')}
                      </Typography>
                      <Typography variant="body2">{event.title}</Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

interface WeekViewProps {
  days: Date[];
  events: CalendarEvent[];
  onCreate: (date: Date) => void;
  onEdit: (event: CalendarEvent) => void;
}

const WeekView = ({ days, events, onCreate, onEdit }: WeekViewProps) => {
  const theme = useTheme();
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index);
  const gridHeight = (END_HOUR - START_HOUR) * HOUR_ROW_HEIGHT;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'neutral.darker',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: `72px repeat(${days.length}, minmax(0, 1fr))` }}>
        <Box sx={{ bgcolor: 'info.dark', borderBottom: 1, borderColor: 'neutral.darker' }} />
        {days.map((day) => (
          <Stack
            key={day.toISOString()}
            alignItems="center"
            justifyContent="center"
            spacing={0.25}
            sx={{
              py: 1.5,
              bgcolor: 'info.dark',
              borderBottom: 1,
              borderLeft: 1,
              borderColor: 'neutral.darker',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {format(day, 'EEE')}
            </Typography>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: 1,
                bgcolor: isToday(day) ? 'primary.main' : 'transparent',
                color: isToday(day) ? 'info.darker' : 'text.primary',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Typography variant="subtitle2">{format(day, 'd')}</Typography>
            </Box>
          </Stack>
        ))}

        <Box sx={{ position: 'relative', bgcolor: 'info.dark' }}>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: HOUR_ROW_HEIGHT,
                borderTop: 1,
                borderColor: 'neutral.darker',
                px: 1.25,
                py: 0.75,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {format(setHours(new Date(), hour), 'ha')}
              </Typography>
            </Box>
          ))}
        </Box>

        {days.map((day) => {
          const dayEvents = events.filter((event) => eventTouchesDay(event, day));

          return (
            <Box
              key={day.toISOString()}
              sx={{
                position: 'relative',
                height: gridHeight,
                borderLeft: 1,
                borderColor: 'neutral.darker',
                bgcolor: 'info.main',
              }}
            >
              {hours.map((hour) => (
                <Box
                  key={`${day.toISOString()}-${hour}`}
                  onClick={() => onCreate(setMinutes(setHours(day, hour), 0))}
                  sx={{
                    height: HOUR_ROW_HEIGHT,
                    borderTop: 1,
                    borderColor: 'neutral.darker',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                />
              ))}

              {dayEvents.map((event) => {
                const category = getCategory(event.calendarId);
                const metrics = getEventBlockMetrics(event);
                return (
                  <Box
                    key={event.id}
                    onClick={() => onEdit(event)}
                    sx={{
                      position: 'absolute',
                      top: metrics.top,
                      left: 8,
                      right: 8,
                      height: metrics.height,
                      borderLeft: 3,
                      borderColor: `${category.color}.main`,
                      bgcolor: alpha(theme.palette[category.color].main, 0.14),
                      borderRadius: 1,
                      px: 1.25,
                      py: 0.75,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="caption" display="block" color="text.secondary">
                      {event.isAllDay ? 'All day' : `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`}
                    </Typography>
                    <Typography variant="body2">{event.title}</Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

interface EventDialogProps {
  categories: CalendarCategory[];
  draft: EventDraft;
  editingEvent: CalendarEvent | null;
  onChange: React.Dispatch<React.SetStateAction<EventDraft>>;
  onClose: () => void;
  onDelete: () => void;
  onSave: (draft: EventDraft) => void;
  open: boolean;
}

const EventDialog = ({
  categories,
  draft,
  editingEvent,
  onChange,
  onClose,
  onDelete,
  onSave,
  open,
}: EventDialogProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{editingEvent ? 'Edit calendar event' : 'New calendar event'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} pt={0.5}>
            <Alert severity="info" sx={{ bgcolor: 'info.dark', color: 'text.secondary' }}>
              This calendar now lives inside the main app shell. No separate theme, route tree, or global DOM state.
            </Alert>

            <TextField
              required
              label="Title"
              value={draft.title}
              onChange={(event) => onChange((current) => ({ ...current, title: event.target.value }))}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                required
                type="date"
                label="Date"
                value={draft.date}
                onChange={(event) => onChange((current) => ({ ...current, date: event.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                select
                label="Calendar"
                value={draft.calendarId}
                onChange={(event) => onChange((current) => ({ ...current, calendarId: event.target.value }))}
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  checked={draft.isAllDay}
                  onChange={(event) => onChange((current) => ({ ...current, isAllDay: event.target.checked }))}
                />
              }
              label="All-day event"
            />

            {!draft.isAllDay ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  required
                  type="time"
                  label="Start"
                  value={draft.startTime}
                  onChange={(event) => onChange((current) => ({ ...current, startTime: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  required
                  type="time"
                  label="End"
                  value={draft.endTime}
                  onChange={(event) => onChange((current) => ({ ...current, endTime: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>
            ) : null}

            <TextField
              label="Location"
              value={draft.location}
              onChange={(event) => onChange((current) => ({ ...current, location: event.target.value }))}
            />

            <TextField
              label="Notes"
              value={draft.description}
              onChange={(event) => onChange((current) => ({ ...current, description: event.target.value }))}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Box>{editingEvent ? <Button color="error" onClick={onDelete}>Delete</Button> : null}</Box>
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CalendarPage;
