'use client';

import { useState } from 'react';
import CustomAccordion from './CustomAccordion';
import { getField, t } from '@/lib/fieldUtils';
import type { Field, FormState, HandleOnChange } from '@/lib/types';

interface Props {
  values: FormState;
  handleOnChange: HandleOnChange;
  hiddenOptions?: string[];
}

export default function Extras({ values, handleOnChange, hiddenOptions }: Props) {
  const [openAccordions, setOpenAccordions] = useState<number[]>([
    0, 1, 2, 3, 4,
  ]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const onActivitiesChange = (key: string, checked: boolean) => {
    const newArray = [...values.activities];
    if (!checked) {
      newArray.splice(newArray.indexOf(key), 1);
    } else {
      newArray.push(key);
    }
    handleOnChange(undefined, { id: 'activities', value: newArray });
  };

  const activitiesField = getField('activities');
  const extraServiceOptions = getField('extraServices')?.options.filter(
    (o) => !hiddenOptions?.includes(o.key!)
  );

  return (
    <div className="mt-4">
      <h3 className="text-base font-medium border-b border-gray-300 pb-1 mb-2">
        {t('servicesTitle')}
      </h3>

      <CustomAccordion
        title="foodOptions"
        index={0}
        isOpen={openAccordions.includes(0)}
        onToggle={toggleAccordion}
        getField={getField as (key: string) => Field}
        values={values as Record<string, unknown>}
        handleOnChange={handleOnChange}
      />

      <div
        className={`border-b border-gray-200${
          !openAccordions.includes(1) ? ' mb-2' : ''
        }`}
      >
        <button
          type="button"
          className="w-full text-left py-2 flex items-center gap-2 font-medium text-base hover:text-brand transition-colors"
          onClick={() => toggleAccordion(1)}
        >
          <span
            className={`transition-transform duration-200 ${
              openAccordions.includes(1) ? 'rotate-90' : ''
            }`}
          >
            ▶
          </span>
          {t('activities')}
        </button>

        {openAccordions.includes(1) && (
          <div className="pb-2 pl-4">
            <a
              href="https://www.nuuksiontaika.fi/palvelut/ohjelmat/"
              target="_blank"
              rel="noreferrer"
              className="text-brand underline text-sm"
            >
              Tutki Nuuksion Taian ohjelmatarjontaa
            </a>
            <div className="grid grid-cols-1 gap-x-4 mt-1">
              {activitiesField?.options.map((activitySet, i) => (
                <div key={i}>
                  {activitySet.title && (
                    <p className="text-sm mt-1">
                      {activitySet.title}
                    </p>
                  )}
                  {(activitySet.options as string[] | undefined)?.map(
                    (activity, j) => (
                      <div key={j} className="flex items-center gap-1.5 my-0.5">
                        <input
                          type="checkbox"
                          id={`activity-${i}-${j}`}
                          checked={values.activities.includes(activity)}
                          onChange={(e) =>
                            onActivitiesChange(activity, e.target.checked)
                          }
                          className="accent-brand"
                        />
                        <label
                          htmlFor={`activity-${i}-${j}`}
                          className="text-sm cursor-pointer"
                        >
                          {activity}
                        </label>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CustomAccordion
        title="rentalEquipment"
        index={2}
        isOpen={openAccordions.includes(2)}
        onToggle={toggleAccordion}
        getField={getField as (key: string) => Field}
        values={values as Record<string, unknown>}
        handleOnChange={handleOnChange}
      />

      <CustomAccordion
        title="extraServices"
        options={extraServiceOptions as { key: string; fi?: string }[]}
        index={3}
        isOpen={openAccordions.includes(3)}
        onToggle={toggleAccordion}
        getField={getField as (key: string) => Field}
        values={values as Record<string, unknown>}
        handleOnChange={handleOnChange}
      />
    </div>
  );
}
