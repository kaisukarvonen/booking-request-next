'use client';

import LocationSelection from './LocationSelection';
import type { HandleOnChange, LocationObj } from '@/lib/types';

interface Props {
  values: { locationObj?: LocationObj };
  handleOnChange: HandleOnChange;
}

export default function CompanyForm({ values, handleOnChange }: Props) {
  return (
    <LocationSelection
      handleOnChange={handleOnChange}
      values={values}
      visitType="companyAccommodations"
    />
  );
}
