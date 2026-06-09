'use client';

import { t } from '@/lib/fieldUtils';
import type { HandleOnChange } from '@/lib/types';

interface Props {
  values: { visitType?: string; visitTypeString: string };
  handleOnChange: HandleOnChange;
  handleRadioChange: (id: string, value: string) => void;
}

export default function PrivatePersonForm({
  values,
  handleOnChange,
  handleRadioChange,
}: Props) {
  const visitTypes = [
    { key: 'birthday', label: t('birthday') },
    { key: 'bachelor', label: t('bachelor') },
    { key: 'party', label: t('party') },
  ];

  return (
    <div className="mt-2">
      <h4 className="text-base font-medium mb-1">{t('visitTypeTitle')}</h4>
      <div className="flex flex-col gap-1">
        {visitTypes.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              type="radio"
              name="visitType"
              value={key}
              checked={values.visitType === key}
              onChange={() => handleRadioChange('visitType', key)}
              className="accent-brand"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="mt-2 max-w-xs">
        <label className="block text-sm font-medium mb-0.5">
          {t('visitTypeString')}
        </label>
        <input
          type="text"
          id="visitTypeString"
          value={values.visitTypeString}
          onChange={(e) =>
            handleOnChange(e, { id: 'visitTypeString', value: e.target.value })
          }
          className="input-field w-full"
        />
      </div>
    </div>
  );
}
