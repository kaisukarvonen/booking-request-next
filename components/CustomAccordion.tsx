'use client';

import type { Field, HandleOnChange } from '@/lib/types';

interface Props {
  title: string;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
  options?: { key: string; fi?: string; infoFi?: string }[];
  getField: (key: string) => Field | undefined;
  values: Record<string, unknown>;
  handleOnChange: HandleOnChange;
  extraInfo?: string;
  small?: boolean;
}

export default function CustomAccordion({
  title,
  index,
  isOpen,
  onToggle,
  options,
  getField,
  values,
  handleOnChange,
  extraInfo,
}: Props) {
  const field = getField(title);
  const displayOptions = options ?? field?.options ?? [];

  return (
    <div className={`border-b border-gray-200${!isOpen ? ' mb-2' : ''}`}>
      <button
        type="button"
        className="w-full text-left py-2 flex items-center gap-2 font-medium text-md hover:text-brand transition-colors"
        onClick={() => onToggle(index)}
      >
        <span
          className={`inline-block transition-transform duration-200 ${isOpen ? 'rotate-90 mb-1' : ''}`}
        >
          ▶
        </span>
        <span>{field?.fi}</span>
      </button>

      {isOpen && (
        <div className="pb-2 pl-4">
          {displayOptions.map((opt) => (
            <div key={opt.key} className="flex items-center gap-1.5 my-0.5">
              <input
                type="checkbox"
                id={opt.key}
                checked={!!values[opt.key ?? '']}
                onChange={(e) =>
                  handleOnChange(e, { id: opt.key ?? '', type: 'checkbox', checked: e.target.checked })
                }
                className="accent-brand"
              />
              <label htmlFor={opt.key} className="text-sm cursor-pointer">
                {opt.fi}
              </label>
            </div>
          ))}
          {extraInfo && <p className="text-sm mt-1 text-gray-600">{extraInfo}</p>}
        </div>
      )}
    </div>
  );
}
