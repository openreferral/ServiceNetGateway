import moment from 'moment';

import { APP_LOCAL_DATETIME_FORMAT, APP_LOCAL_DATETIME_FORMAT_Z } from 'app/config/constants';

export const convertDateTimeFromServer = date => (date ? moment(date).format(APP_LOCAL_DATETIME_FORMAT) : null);

export const convertDateTimeToServer = date => (date ? moment(date, APP_LOCAL_DATETIME_FORMAT_Z).toDate() : null);

export const displayDefaultDateTime = () =>
  moment()
    .startOf('day')
    .format(APP_LOCAL_DATETIME_FORMAT);

export const getWeekday = (weekdayNumber: number, format = 'short') => {
  const date = new Date();
  const currentDay = date.getDay();
  const distance = weekdayNumber - currentDay;
  date.setDate(date.getDate() + distance);
  return date.toLocaleString('en-US', { weekday: format });
};

export const dateWithoutTz = dateToFormat => {
  const date = new Date(dateToFormat);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

export const dateWithTz = dateToFormat => {
  const date = new Date(dateToFormat);
  return date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
};

export const getDateWithTime = time => Date.parse('01 Jan 1970 ' + time);

export const getTimeString = date => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const daysBetweenDates = (start, end) => {
  const dates = [];
  const endDate = new Date(end);
  for (const dt = new Date(start); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
    dates.push(new Date(dt));
  }
  return dates;
};
