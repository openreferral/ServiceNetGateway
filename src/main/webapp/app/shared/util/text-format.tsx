import * as React from 'react';
import * as numeral from 'numeral';
import * as moment from 'moment';

/**
 * Formats the given value to specified type like date or number.
 * @param value value to be formatted
 * @param type type of formatting to use ${ITextFormatTypes}
 * @param format optional format to use.
 *    For date type momentJs(http://momentjs.com/docs/#/displaying) format is used
 *    For number type NumeralJS (http://numeraljs.com/#format) format is used
 * @param blankOnInvalid optional to output error or blank on null/invalid values
 */
export const formatText = (value, type, format, blankOnInvalid) => {
  if (blankOnInvalid) {
    if (!value || !type) return null;
  }

  if (type === 'date') {
    // @ts-ignore
    return moment(value).format(format);
  } else if (type === 'number') {
    return (numeral(value) as any).format(format);
  }
  return value;
};
