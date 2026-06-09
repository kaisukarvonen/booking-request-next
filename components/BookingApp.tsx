'use client';

import { useEffect, useState } from 'react';
import Form from './Form';
import CalendarPicker from './CalendarPicker';
import { getCalendarEvents, formatDates } from '@/lib/calendarUtils';
import type { CalendarState } from '@/lib/types';

interface Props {
  calendarOnly?: boolean;
  customerType?: 'company' | 'private';
}

export default function BookingApp({ calendarOnly, customerType }: Props) {
  const [calendarData, setCalendarData] = useState<CalendarState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [villaEvents, wainolaEvents] = await Promise.all([
          getCalendarEvents(false),
          getCalendarEvents(true),
        ]);
        setCalendarData({
          villa: formatDates(villaEvents),
          wainola: formatDates(wainolaEvents),
        });
      } catch {
        setCalendarData({});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (calendarOnly) {
    return (
      <CalendarPicker
        from={undefined}
        to={undefined}
        onSelect={() => {}}
        disabledDays={calendarData.villa?.disabledDays}
        availableFrom16={calendarData.villa?.from16}
        availableUntil12={calendarData.villa?.until12}
        calendarOnly
        loading={loading}
      />
    );
  }

  return (
    <Form
      customerType={customerType}
      disabledDays={calendarData}
      availableFrom16={calendarData}
      availableUntil12={calendarData}
      calendarLoading={loading}
    />
  );
}
