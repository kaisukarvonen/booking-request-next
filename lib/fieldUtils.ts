import type { Field, FieldOption } from './types';
import rawFields from '@/data/fields.json';

export const fields = rawFields as Field[];

export const getField = (key: string): Field | undefined =>
  fields.find((f) => f.key === key);

export const t = (key: string, fallback = ''): string =>
  getField(key)?.fi ?? fallback;

export const getFieldOption = (key: string, innerKey: string): FieldOption | undefined =>
  getField(key)?.options.find((o) => o.key === innerKey);
