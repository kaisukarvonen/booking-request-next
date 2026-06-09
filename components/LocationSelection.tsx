'use client';

import { useState } from 'react';
import { getField, t } from '@/lib/fieldUtils';
import type { FieldOption, HandleOnChange, LocationObj } from '@/lib/types';

interface Props {
  values: { locationObj?: LocationObj };
  handleOnChange: HandleOnChange;
  visitType: string;
}

export default function LocationSelection({ values, handleOnChange, visitType }: Props) {
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const onLocationChange = (
    locationOption: FieldOption,
    optionValue: string | undefined,
    checked: boolean
  ) => {
    const { options: _opts, ...locationObj } = locationOption as FieldOption & { options?: unknown };
    handleOnChange(undefined, {
      id: 'locationObj',
      value: checked ? { option: optionValue, ...locationObj } : undefined,
    });
  };

  const field = getField(visitType);
  const options = field?.options ?? [];

  return (
    <div>
      <h3 className="text-base font-medium border-b border-gray-300 pb-1 mt-3 mb-2">
        {t('accommodationTitle')}
      </h3>

      {options.map((locationOption, index) => {
        const subOptions = locationOption.options as string[] | undefined;
        const isOpen = openAccordions.includes(index);

        if (subOptions?.length) {
          return (
            <div key={locationOption.title} className="border-b border-gray-200">
              <button
                type="button"
                className="w-full text-left py-2 flex items-center gap-1 font-medium text-base hover:text-brand"
                onClick={() => toggleAccordion(index)}
              >
                <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                {locationOption.title}
              </button>
              {isOpen && (
                <div className="pl-4 pb-2">
                  {subOptions.map((optVal) => (
                    <div key={optVal} className="flex items-center gap-1.5 my-0.5">
                      <input
                        type="checkbox"
                        id={`${locationOption.title}-${optVal}`}
                        checked={
                          values.locationObj?.option === optVal &&
                          values.locationObj?.title === locationOption.title
                        }
                        onChange={(e) =>
                          onLocationChange(locationOption, optVal, e.target.checked)
                        }
                        className="accent-brand"
                      />
                      <label
                        htmlFor={`${locationOption.title}-${optVal}`}
                        className="text-base cursor-pointer"
                      >
                        {optVal}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={locationOption.title} className="py-1 pl-1 mb-1">
            <div className="flex items-start gap-1.5">
              <input
                type="checkbox"
                id={locationOption.title}
                checked={values.locationObj?.title === locationOption.title}
                onChange={(e) => onLocationChange(locationOption, undefined, e.target.checked)}
                className="accent-brand mt-[2px]"
              />
              <label
                htmlFor={locationOption.title}
                className="text-base cursor-pointer"
              >
                {locationOption.title}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
