import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { APP_LOCAL_DATETIME_FORMAT, APP_LOCAL_DATETIME_FORMAT_Z } from 'app/config/constants';
import moment from 'moment';

describe('Date utils', () => {
  describe('convertDateTimeFromServer', () => {
    it('should format the date to APP_LOCAL_DATETIME_FORMAT', () => {
      const date = new Date();
      const formattedDate = convertDateTimeFromServer(date);
      expect(moment(formattedDate, APP_LOCAL_DATETIME_FORMAT, true).isValid()).toEqual(true);
    });

    it('should return null if input is empty', () => {
      expect(convertDateTimeFromServer(null)).toEqual(null);
    });
  });

  describe('convertDateTimeToServer', () => {
    it('should load the date in APP_LOCAL_DATETIME_FORMAT_Z format', () => {
      const date = new Date();
      expect(convertDateTimeToServer(date)).toEqual(moment(date, APP_LOCAL_DATETIME_FORMAT_Z).toDate());
    });

    it('should return null if input is empty', () => {
      expect(convertDateTimeToServer(null)).toEqual(null);
    });
  });

  describe('displayDefaultDateTime', () => {
    it('should return start of the day', () => {
      const defaultDateTime = displayDefaultDateTime();
      expect(defaultDateTime === moment().startOf('day').format(APP_LOCAL_DATETIME_FORMAT)).toEqual(true);
    });

    it('should format the date to APP_LOCAL_DATETIME_FORMAT', () => {
      const defaultDateTime = displayDefaultDateTime();
      expect(moment(defaultDateTime, APP_LOCAL_DATETIME_FORMAT, true).isValid()).toEqual(true);
    });
  });
});
