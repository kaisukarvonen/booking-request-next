'use client';

import { useState } from 'react';
import BasicDetails from './BasicDetails';
import Extras from './Extras';
import Notification from './Notification';
import { getField, t } from '@/lib/fieldUtils';
import { createEmailHTML, dateToStr } from '@/lib/createHTML';
import type { CalendarState, DateRange, FormState, HandleOnChange } from '@/lib/types';

const initialForm: FormState = {
  from: undefined,
  to: undefined,
  personAmount: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  companyName: '',
  budget: '',
  moreInformation: '',
  visitType: undefined,
  visitTypeString: '',
  locationObj: undefined,
  cottages: [],
  activities: [],
  arrivalTime: '',
  departTime: '',
  newsLetter: true,
};

interface Props {
  customerType?: 'company' | 'private';
  disabledDays: CalendarState;
  availableFrom16: CalendarState;
  availableUntil12: CalendarState;
  calendarLoading: boolean;
}

function validEmail(email: string) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    email
  );
}

function cottageOptions(period: 'winter' | 'summer', fields: ReturnType<typeof getField>): boolean[] {
  const cottage = fields?.options.find((o) => o.key === 'cottage');
  const choices = cottage?.[period]?.choices ?? [];
  return new Array(choices.length).fill(false);
}

export default function Form({
  customerType,
  disabledDays,
  availableFrom16,
  availableUntil12,
  calendarLoading,
}: Props) {
  const [formData, setFormData] = useState<FormState>({
    ...initialForm,
    type: customerType,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [showPrivateForm, setShowPrivateForm] = useState(false);
  const [showVillaParatiisiPrivateForm, setShowVillaParatiisiPrivateForm] = useState(false);
  const [activePeriod, setActivePeriod] = useState<'winter' | 'summer' | undefined>();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleOnChange: HandleOnChange = (_e, data) => {
    setFormData((prev) => ({
      ...prev,
      [data.id]: data.type === 'checkbox' ? data.checked : data.value,
      ...(data.id === 'visitTypeString' ? { visitType: undefined } : {}),
    }));
  };

  const handleRadioChange = (id: string, value: string) => {
    const resets: Partial<FormState> = {
      locationObj: undefined,
      visitTypeString: '',
    };
    if (id === 'type' && formData.type !== value) {
      Object.assign(resets, { visitType: undefined, companyName: '' });
      if (value === 'private') {
        Object.assign(resets, { departTime: '12', arrivalTime: '16' });
      }
    } else if (id === 'visitType' && formData.visitType !== value) {
      // just reset location and string
    }
    setFormData((prev) => ({ ...prev, [id]: value, ...resets }));
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    const newFrom = range?.from;
    const newTo = range?.to;
    if (!newFrom) return;

    let { arrivalTime, departTime } = formData;
    if (formData.type !== 'company') {
      arrivalTime = '16';
      departTime = '12';
    }

    const period: 'winter' | 'summer' = [10, 11, 0, 1, 2, 3].includes(newFrom.getMonth())
      ? 'winter'
      : 'summer';

    let { cottages } = formData;
    if (activePeriod !== period || !cottages.length) {
      cottages = cottageOptions(period, getField('extraPersons'));
      setActivePeriod(period);
    }

    setFormData((prev) => ({
      ...prev,
      from: newFrom,
      to: newTo,
      arrivalTime,
      departTime,
      cottages,
    }));
  };

  const setType = (type: 'company' | 'private') => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const isValid = () => {
    const date = formData.to || formData.from;
    const mandatoryFilled =
      date &&
      formData.name &&
      formData.email &&
      formData.personAmount;
    const emailOk = validEmail(formData.email);
    setErrors({
      mandatoryFields: mandatoryFilled ? undefined : 'Täytä pakolliset kentät!',
      isValidEmail: emailOk ? undefined : 'Tarkista että sähköposti on oikeassa muodossa!',
    });
    return !!mandatoryFilled && emailOk;
  };

  const createMail = async () => {
    if (!isValid()) return;
    setSendingEmail(true);
    try {
      const { title, html } = createEmailHTML(formData);
      const res1 = await fetch('/api/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, title, html }),
      });
      if (!res1.ok) throw new Error(await res1.text());
      const res2 = await fetch('/api/mail/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          title: 'Kopio lähettämästäsi tarjouspyynnöstä',
          html,
        }),
      });
      if (!res2.ok) throw new Error(await res2.text());
      setNotification({ type: 'success', message: 'Tarjouspyyntösi on lähetetty onnistuneesti!' });
    } catch {
      setNotification({ type: 'error', message: 'Virhe! Tarjouspyynnön lähetys epäonnistui.' });
    } finally {
      setSendingEmail(false);
    }
  };

  const isCompany = formData.type === 'company';
  const showPrivate = formData.type === 'private' && (showPrivateForm || showVillaParatiisiPrivateForm);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full px-4 py-10 flex-grow">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[
            { text: 'Yritysasiakas', type: 'company' as const },
            { text: 'Yksityisasiakas', type: 'private' as const },
          ].map((c) => (
            <button
              key={c.type}
              type="button"
              className={`btn btn-lg ${formData.type === c.type ? 'btn-active' : ''}`}
              onClick={() => setType(c.type)}
            >
              {c.text}
            </button>
          ))}
        </div>

        {formData.type && (
          <>
            <BasicDetails
              formData={formData}
              handleOnChange={handleOnChange}
              handleRangeSelect={handleRangeSelect}
              handleRadioChange={handleRadioChange}
              disabledDays={disabledDays}
              availableFrom16={availableFrom16}
              availableUntil12={availableUntil12}
              dateToStr={dateToStr}
              setShowPrivateForm={setShowPrivateForm}
              showPrivateForm={formData.type === 'private' && showPrivateForm}
              showVillaParatiisiPrivateForm={showVillaParatiisiPrivateForm}
              setShowVillaParatiisiPrivateForm={setShowVillaParatiisiPrivateForm}
              calendarLoading={calendarLoading}
            />

            {Object.values(errors).some(Boolean) && (
              <div className="mt-3 p-2 bg-red-50 border border-red-300 text-red-700 text-sm">
                {Object.values(errors).filter(Boolean).map((msg, i) => (
                  <p key={i}>{msg}</p>
                ))}
              </div>
            )}

            {(showPrivate || isCompany) && (
              <>
                <Extras
                  values={formData}
                  handleOnChange={handleOnChange}
                />

                <div className="mt-4 p-2 bg-gray-50 border border-gray-200 text-sm">
                  {getField('paymentInfo')?.[formData.type as 'company' | 'private']?.fi}
                  <div className="mt-1">
                    Tutustu{' '}
                    <a
                      href="https://www.nuuksiontaika.fi/meesta/ehdot/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand underline"
                    >
                      varausehtoihin.
                    </a>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newsLetter"
                    checked={!!formData.newsLetter}
                    onChange={(e) =>
                      handleOnChange(e, {
                        id: 'newsLetter',
                        type: 'checkbox',
                        checked: e.target.checked,
                      })
                    }
                    className="accent-brand"
                  />
                  <label htmlFor="newsLetter" className="text-sm cursor-pointer">
                    Tilaan uutiskirjeen
                  </label>
                </div>

                <button
                  type="button"
                  className="btn-primary mt-4 px-6 py-2"
                  onClick={createMail}
                  disabled={sendingEmail}
                >
                  {sendingEmail ? 'Viestiäsi lähetetään …' : 'Lähetä'}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
