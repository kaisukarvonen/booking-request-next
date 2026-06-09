export interface FieldOption {
  key?: string;
  fi?: string;
  en?: string;
  price?: number;
  alvPrice?: number;
  priceInfoFi?: string;
  infoFi?: string;
  infoEn?: string;
  duration?: number;
  title?: string;
  options?: string[] | FieldOption[];
  useVillaCalendar?: boolean;
  useWainolaCalendar?: boolean;
  useCalendar?: boolean;
  winter?: { choices: number[]; 1?: number; 2?: number };
  summer?: { choices: number[]; 1?: number; 2?: number };
}

export interface Field {
  key?: string;
  fi?: string;
  en?: string;
  url?: string;
  max?: number;
  price?: number;
  alvPrice?: number;
  summer?: Record<string, string>;
  winter?: Record<string, string>;
  company?: { fi: string };
  private?: { fi: string };
  options: FieldOption[];
}

export interface LocationObj {
  title: string;
  option?: string;
  useVillaCalendar?: boolean;
  useWainolaCalendar?: boolean;
  useCalendar?: boolean;
}

export interface FormState {
  type?: 'company' | 'private';
  from?: Date;
  to?: Date;
  personAmount: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName: string;
  budget: string;
  moreInformation: string;
  visitType?: string;
  visitTypeString: string;
  locationObj?: LocationObj;
  cottages: boolean[];
  activities: string[];
  arrivalTime: string;
  departTime: string;
  newsLetter: boolean;
  // food options
  breakfast?: boolean;
  lunch?: boolean;
  nokipannu?: boolean;
  snack?: boolean;
  dinner?: boolean;
  iltapala?: boolean;
  // rental equipment
  supBoards?: boolean;
  canoes?: boolean;
  skinbasedski?: boolean;
  kickbikes?: boolean;
  snowshoes?: boolean;
  // extra services
  lakanat?: boolean;
  pyyhkeet?: boolean;
  palju?: boolean;
  // other programs
  jurttasauna?: boolean;
  liveMusic?: boolean;
  [key: string]: unknown;
}

export interface CalendarData {
  disabledDays: Date[];
  from16: Date[];
  until12: Date[];
}

export interface CalendarState {
  villa?: CalendarData;
  wainola?: CalendarData;
}

export type { DateRange } from 'react-day-picker';

export type HandleOnChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | undefined,
  data: { id: string; type?: string; checked?: boolean; value?: unknown }
) => void;
