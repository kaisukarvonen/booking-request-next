'use client';

import { useEffect, useRef, useState } from 'react';
import CalendarPicker from './CalendarPicker';
import CompanyForm from './CompanyForm';
import PrivatePersonForm from './PrivatePersonForm';
import { t } from '@/lib/fieldUtils';
import type {
  CalendarData,
  DateRange,
  FormState,
  HandleOnChange,
} from '@/lib/types';

// DateRange re-export for convenience
export type { DateRange };

interface Props {
  formData: FormState;
  handleOnChange: HandleOnChange;
  handleRangeSelect: (range: DateRange | undefined) => void;
  handleRadioChange: (id: string, value: string) => void;
  disabledDays: { villa?: CalendarData; wainola?: CalendarData };
  availableFrom16: { villa?: CalendarData; wainola?: CalendarData };
  availableUntil12: { villa?: CalendarData; wainola?: CalendarData };
  dateToStr: (from?: Date, to?: Date) => string;
  setShowPrivateForm: (v: boolean) => void;
  showPrivateForm: boolean;
  showVillaParatiisiPrivateForm: boolean;
  setShowVillaParatiisiPrivateForm: (v: boolean) => void;
  calendarLoading: boolean;
}

const timeOptions = Array.from({ length: 17 }, (_, i) => {
  const h = 8 + i;
  return { value: `${h}`, label: `${h}:00` };
});

export default function BasicDetails({
  formData,
  handleOnChange,
  handleRangeSelect,
  handleRadioChange,
  disabledDays,
  availableFrom16,
  availableUntil12,
  dateToStr,
  setShowPrivateForm,
  showPrivateForm,
  showVillaParatiisiPrivateForm,
  setShowVillaParatiisiPrivateForm,
  calendarLoading,
}: Props) {
  const [popupOpen, setPopupOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popupOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target as Node)
      ) {
        setPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [popupOpen]);

  const isCompany = formData.type === 'company';
  const isPrivate = formData.type === 'private';

  const calendarType =
    showPrivateForm || formData.locationObj?.useWainolaCalendar
      ? 'wainola'
      : 'villa';

  const calData = {
    disabled: disabledDays[calendarType]?.disabledDays ?? [],
    from16: availableFrom16[calendarType]?.from16 ?? [],
    until12: availableUntil12[calendarType]?.until12 ?? [],
  };

  const alwaysAvailable =
    isCompany &&
    !formData.locationObj?.useVillaCalendar &&
    !formData.locationObj?.useWainolaCalendar;

  const dateValue = dateToStr(formData.from, formData.to);

  const renderCalendar = (className: string, compact?: boolean) => (
    <CalendarPicker
      className={className}
      from={formData.from}
      to={formData.to}
      onSelect={handleRangeSelect}
      disabledDays={calData.disabled}
      availableFrom16={calData.from16}
      availableUntil12={calData.until12}
      alwaysAvailable={alwaysAvailable}
      compact={compact}
      loading={calendarLoading}
    />
  );

  return (
    <>
      {isPrivate && (
        <div className="flex flex-wrap gap-2 my-4 justify-center">
          <button
            type="button"
            className={`btn btn-sm ${
              showVillaParatiisiPrivateForm ? 'btn-active' : ''
            }`}
            onClick={() => {
              setShowVillaParatiisiPrivateForm(true);
              setShowPrivateForm(false);
            }}
          >
            {t('villaParatiisiSelectionTitle')}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${showPrivateForm ? 'btn-active' : ''}`}
            onClick={() => {
              setShowPrivateForm(true);
              setShowVillaParatiisiPrivateForm(false);
            }}
          >
            {t('wainolaSelectionTitle')}
          </button>
        </div>
      )}

      {showVillaParatiisiPrivateForm && (
        <div className="mb-4 flex flex-col items-center">
          <p className="text-sm text-gray-900 mt-1">
            Haluatko vuokrata vain tilan? Varaa suoraan {' '}
            <a
              href="https://nuuksiontaika.johku.com/fi_FI/vuokratilat/mokki-nuuksio"
              target="_blank"
              rel="noreferrer"
              className="text-brand underline"
            >
              verkkokaupasta
            </a>
            .
          </p>
        </div>
      )}

      {showPrivateForm && (
        <h3 className="text-base font-medium border-b border-gray-300 pb-1 mt-4 mb-2">
          {t('wainolaTitle')}
        </h3>
      )}

      {showVillaParatiisiPrivateForm && (
        <h3 className="text-base font-medium border-b border-gray-300 pb-1 mt-4 mb-2">
          {t('villaParatiisiSelectionTitle')}
        </h3>
      )}

      {isCompany && (
        <CompanyForm handleOnChange={handleOnChange} values={formData} />
      )}

      {(showPrivateForm || showVillaParatiisiPrivateForm || isCompany) && (
        <>
          {(formData.locationObj?.title ||
            showPrivateForm ||
            showVillaParatiisiPrivateForm) && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-4 items-end mb-2">
                <div className="relative flex-[2]" ref={datePickerRef}>
                  <label className="block text-sm mb-0.5">
                    {t('dates')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      readOnly
                      id="dates"
                      value={dateValue}
                      onClick={() => setPopupOpen(true)}
                      className="input-field w-full cursor-pointer"
                      placeholder="Valitse päivät"
                    />
                  </div>
                  {popupOpen && (
                    <div className="absolute z-50 bg-white border border-gray-300 shadow-lg p-2 left-0 top-full mt-1">
                      <div className="flex justify-end mb-1">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-black text-4xl leading-[19px]"
                          onClick={() => setPopupOpen(false)}
                        >
                          ×
                        </button>
                      </div>
                      {renderCalendar('hide-mobile')}
                      {renderCalendar('hide-fullscreen', true)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm mb-0.5">
                    {t('arrivalTime')}
                  </label>
                  <select
                    id="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={(e) =>
                      handleOnChange(e, {
                        id: 'arrivalTime',
                        value: e.target.value,
                      })
                    }
                    className="input-field w-full"
                  >
                    <option value="">hh:mm</option>
                    {timeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm mb-0.5">
                    {t('departTime')}
                  </label>
                  <select
                    id="departTime"
                    value={formData.departTime}
                    onChange={(e) =>
                      handleOnChange(e, {
                        id: 'departTime',
                        value: e.target.value,
                      })
                    }
                    className="input-field w-full"
                  >
                    <option value="">hh:mm</option>
                    {timeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {t('dateExplanation') && (
                <p className="text-sm text-gray-600">{t('dateExplanation')}</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-2">
            <div>
              <label className="block text-sm mb-0.5">
                {t('personAmount')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="personAmount"
                min={1}
                value={formData.personAmount}
                onChange={(e) =>
                  handleOnChange(e, {
                    id: 'personAmount',
                    value: e.target.value,
                  })
                }
                className="input-field w-24"
              />
            </div>
            <div className="flex-1 min-w-40">
              <label className="block text-sm mb-0.5">
                {t('budget')}
              </label>
              <input
                type="text"
                id="budget"
                value={formData.budget}
                onChange={(e) =>
                  handleOnChange(e, { id: 'budget', value: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
          </div>
        </>
      )}

      {(showPrivateForm || showVillaParatiisiPrivateForm) && (
        <PrivatePersonForm
          values={formData}
          handleOnChange={handleOnChange}
          handleRadioChange={handleRadioChange}
        />
      )}

      {(showPrivateForm || showVillaParatiisiPrivateForm || isCompany) && (
        <>
          <h3 className="text-base border-b border-gray-300 pb-1 mt-4 mb-2">
            {t('moreInformationTitle')}
          </h3>
          <textarea
            rows={2}
            id="moreInformation"
            value={formData.moreInformation}
            onChange={(e) =>
              handleOnChange(e, {
                id: 'moreInformation',
                value: e.target.value,
              })
            }
            className="input-field w-full resize-y"
          />

          <h3 className="text-base font-medium border-b border-gray-300 pb-1 mt-4 mb-2">
            {t('basicDetails')}
          </h3>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-40">
              <label className="block text-sm mb-0.5">
                {t('name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  handleOnChange(e, { id: 'name', value: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
            <div className="flex-1 min-w-40">
              <label className="block text-sm mb-0.5">
                {t('email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  handleOnChange(e, { id: 'email', value: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-40">
              <label className="block text-sm mb-0.5">
                {t('phone')}
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  handleOnChange(e, { id: 'phone', value: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
            <div className="flex-1 min-w-40">
              <label className="block text-sm mb-0.5">
                {t('address')}
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) =>
                  handleOnChange(e, { id: 'address', value: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="mt-2 max-w-xs">
            <label className="block text-sm mb-0.5">
              {t('companyName')}
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                handleOnChange(e, { id: 'companyName', value: e.target.value })
              }
              className="input-field w-full"
            />
          </div>
        </>
      )}
    </>
  );
}
