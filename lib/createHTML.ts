import { format, differenceInDays } from 'date-fns';
import { getField, getFieldOption } from './fieldUtils';
import type { FormState } from './types';

export function dateToStr(from?: Date, to?: Date): string {
  if (!from) return '';
  const diff = to ? differenceInDays(to, from) : 0;
  return diff
    ? `${format(from, 'dd.MM.yyyy')} - ${format(to!, 'dd.MM.yyyy')}`
    : format(from, 'dd.MM.yyyy');
}

function row(value: unknown, title?: string): string {
  if (value === undefined || value === null || value === '') return '';
  const isArr = Array.isArray(value);
  if (isArr && (value as unknown[]).length === 0) return '';
  const isHeader = title === 'title';
  const titleHtml = title
    ? `<div><span style="font-size:${isHeader ? '18px' : '16px'}"><b>${isHeader ? value : title}</b></span><br/></div>`
    : '';
  let contentHtml = '';
  if (!isHeader) {
    if (isArr) {
      contentHtml = (value as string[])
        .filter(Boolean)
        .map((v) => `<div><span style="font-size:15px">${v}</span><br/></div>`)
        .join('');
    } else {
      contentHtml = `<span style="font-size:15px">${value}</span>`;
    }
  }
  return `<tr><td style="padding-top:9px;font-family:Verdana">${titleHtml}${contentHtml}</td></tr>`;
}

export function createEmailHTML(
  formData: FormState
): { title: string; html: string } {
  const { from, to } = formData;
  const dateStr = dateToStr(from, to);
  const title = `Tarjouspyyntö ${dateStr}`;
  const description = `Tarjouspyyntö ajalle ${dateStr} henkilöltä ${formData.name}`;

  const food = getField('foodOptions')?.options
    .filter((f) => f.key && formData[f.key])
    .map((f) => f.fi ?? '')
    .join(', ');

  const activities = formData.activities.join(', ');

  const rentalEquip = getField('rentalEquipment')?.options
    .filter((eq) => eq.key && formData[eq.key])
    .map((eq) => getFieldOption('rentalEquipment', eq.key!)?.fi ?? '')
    .filter(Boolean);

  const extraSvc = getField('extraServices')?.options
    .filter((eq) => eq.key && formData[eq.key])
    .map((eq) => getFieldOption('extraServices', eq.key!)?.fi ?? '')
    .filter(Boolean);

  let visitString = '';
  const { locationObj } = formData;
  if (formData.visitType) visitString = getField(formData.visitType)?.fi ?? '';

  const isPrivate = formData.type === 'private';
  let location = '';
  if (!locationObj && isPrivate) {
    location = 'Wäinölä';
  } else if (locationObj) {
    location = `${locationObj.title}${locationObj.option ? ` - ${locationObj.option}` : ''}`;
  }

  const phone = formData.phone
    ? `<a href="tel:${formData.phone}">${formData.phone}</a>`
    : '';

  const rows = [
    row(description),
    '<br/>',
    row(getField('contactDetails')?.fi, 'title'),
    row(getField(formData.type ?? '')?.fi, 'Asiakastyyppi'),
    row(formData.name, getField('name')?.fi),
    row(formData.email, getField('email')?.fi),
    row(phone, getField('phone')?.fi),
    row(formData.address, getField('address')?.fi),
    row(dateStr, getField('dates')?.fi),
    row(formData.arrivalTime ? `klo ${formData.arrivalTime}` : '', getField('arrivalTime')?.fi),
    row(formData.departTime ? `klo ${formData.departTime}` : '', getField('departTime')?.fi),
    row(formData.personAmount, getField('personAmount')?.fi),
    row(formData.budget, getField('budget')?.fi),
    row(food, 'Tarjoilut'),
    row(activities, 'Aktiviteetit ja ohjelmat'),
    row(rentalEquip, 'Vuokravälineet'),
    row(extraSvc, 'Lisäpalvelut'),
    row('Vierailun lisätiedot', 'title'),
    row(visitString || formData.visitTypeString, 'Vierailun tyyppi'),
    row(location, 'Tilat'),
    row(formData.companyName, 'Yrityksen nimi'),
    formData.newsLetter ? row('Kyllä', 'Tilaan uutiskirjeen') : '',
    formData.moreInformation ? row(formData.moreInformation, 'Lisätietoa') : '',
    row(
      '<i>Tarjoilujen ja ohjelmien hinnat määräytyvät saatavuuden mukaan. Pidätämme oikeuden muutoksiin.</i>'
    ),
  ].join('');

  const html = `<div><table width="100%" height="100%" cellPadding="0" cellSpacing="0" border="0" align="left" valign="top" style="font-family:Verdana;margin-bottom:40px"><tbody>${rows}</tbody></table></div>`;

  return { title, html };
}
