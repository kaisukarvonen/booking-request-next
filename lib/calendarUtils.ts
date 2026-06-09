import { addDays, addMonths, format, getHours, isBefore, isEqual, parseISO, startOfDay } from 'date-fns';
import type { CalendarData } from './types';

const GOOGLE_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? 'AIzaSyBPOdx5zUOmEtnPshiD5CR49g7FodUie2A';
const CALENDAR_ID = 'nuuksiontaika@gmail.com';
const WAINOLA_CALENDAR_ID = 'fb1fm92pabif0n1511klrhsq5o@group.calendar.google.com';

interface CalendarEvent {
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

export async function getCalendarEvents(wainolaCalendar: boolean): Promise<CalendarEvent[]> {
  const minDate = startOfDay(new Date()).toISOString();
  const maxDate = addMonths(startOfDay(new Date()), 14).toISOString();
  const calendarId = wainolaCalendar ? WAINOLA_CALENDAR_ID : CALENDAR_ID;

  const params = new URLSearchParams({
    key: GOOGLE_API_KEY,
    timeMin: minDate,
    timeMax: maxDate,
    orderBy: 'startTime',
    singleEvents: 'true',
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items as CalendarEvent[]) ?? [];
}

export function formatDates(events: CalendarEvent[]): CalendarData {
  const disabledDays: Date[] = [];
  const from16: Date[] = [];
  const until12: Date[] = [];

  const today = startOfDay(new Date());

  for (const event of events) {
    if (event.start.date) {
      const end = parseISO(event.end.date!);
      let date = parseISO(event.start.date);
      while (!isEqual(date, end)) {
        disabledDays.push(date);
        date = addDays(date, 1);
      }
    } else {
      const start = parseISO(event.start.dateTime!);
      const end = parseISO(event.end.dateTime!);

      // Disable intermediate days
      const endDateStr = format(end, 'yyyy-MM-dd');
      let cur = start;
      while (format(cur, 'yyyy-MM-dd') !== endDateStr) {
        cur = addDays(cur, 1);
        disabledDays.push(parseISO(format(cur, 'yyyy-MM-dd')));
      }

      // Handle start date
      const fStart = parseISO(format(start, 'yyyy-MM-dd'));
      if (!isBefore(fStart, today)) {
        const startHour = getHours(start);
        const from16Idx = from16.findIndex((d) => isEqual(d, fStart));
        if (startHour < 15) {
          disabledDays.push(fStart);
        } else if (from16Idx !== -1) {
          disabledDays.push(fStart);
          from16.splice(from16Idx, 1);
        } else {
          until12.push(fStart);
        }
      }

      // Handle end date
      const fEnd = parseISO(format(end, 'yyyy-MM-dd'));
      const endHour = getHours(end);
      const until12Idx = until12.findIndex((d) => isEqual(d, fEnd));
      if (endHour > 11) {
        disabledDays.push(fEnd);
      } else if (until12Idx !== -1) {
        disabledDays.push(fEnd);
        until12.splice(until12Idx, 1);
      } else {
        from16.push(fEnd);
      }
    }
  }

  return { disabledDays, from16, until12 };
}
