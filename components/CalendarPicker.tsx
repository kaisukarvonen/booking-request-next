'use client';

import { DayPicker, type DateRange } from 'react-day-picker';
import { fi } from 'date-fns/locale';
import 'react-day-picker/src/style.css';

interface Props {
  from?: Date;
  to?: Date;
  onSelect: (range: DateRange | undefined) => void;
  disabledDays?: Date[];
  availableFrom16?: Date[];
  availableUntil12?: Date[];
  compact?: boolean;
  className?: string;
  calendarOnly?: boolean;
  alwaysAvailable?: boolean;
  loading?: boolean;
}

export default function CalendarPicker({
  from,
  to,
  onSelect,
  disabledDays = [],
  availableFrom16 = [],
  availableUntil12 = [],
  compact,
  className,
  calendarOnly,
  alwaysAvailable,
  loading,
}: Props) {
  if (loading) return null;

  const disabled = alwaysAvailable
    ? [{ before: new Date() }]
    : [{ before: new Date() }, ...disabledDays];

  const modifiers = alwaysAvailable
    ? {}
    : { availableFrom16, availableUntil12 };

  return (
    <div className={className ?? ''}>
      <DayPicker
        locale={fi}
        mode="range"
        numberOfMonths={compact ? 1 : 2}
        navLayout="around"
        selected={{ from, to }}
        onSelect={onSelect}
        disabled={disabled}
        modifiers={modifiers}
        modifiersClassNames={{
          availableFrom16: 'availableFrom16',
          availableUntil12: 'availableUntil12',
        }}
        className={`Selectable${calendarOnly ? ' calendar-only' : ''}`}
      />

      {!alwaysAvailable && (
        <div className="ml-5 mt-1 text-sm">
          <span
            className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-300"
            style={{ backgroundColor: 'var(--color-available-legend)' }}
          />
          Vapaa {calendarOnly && '/ Available'}
          <span className={compact ? 'block mt-1' : 'inline-block'}>
            <span
              className="inline-block w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: 'var(--color-partial)', margin: compact ? '0 8px 0 0' : '0 8px' }}
            />
            Osittain vapaa {calendarOnly && '/ Partly available'}
          </span>
        </div>
      )}

      {calendarOnly && (
        <div className="m-5">
          <div>
            <button
              className="btn btn-sm mb-1.5"
              onClick={() =>
                (window.parent.location.href = 'https://www.nuuksiontaika.fi/tarjouspyynto/')
              }
            >
              Pyydä tarjous
            </button>
          </div>
          <div>
            <button
              className="btn btn-sm"
              onClick={() =>
                (window.location.href =
                  'https://nuuksiontaika.johku.com/fi_FI/vuokratilat/mokki-nuuksio')
              }
            >
              Osta majoitus verkkokaupasta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
