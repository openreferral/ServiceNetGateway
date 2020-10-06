import { mapWeekdayToString } from 'app/shared/util/schedule-utils';

describe('Schedule utils', () => {
  describe('mapWeekdayToString', () => {
    it('should return the weekday for given number', () => {
      const date = new Date();
      for (const day of [0, 1, 2, 3, 4, 5, 6]) {
        const currentDay = date.getDay();
        // getDay() returns days starting with Sunday, not Monday, so we need to shift it by 1
        const difference = (day + 1 % 7) - currentDay;
        date.setDate(date.getDate() + difference);
        expect(mapWeekdayToString(day)).toEqual(
          date.toLocaleString('en-US', { weekday: 'long' })
        );
      }
    });

    it('when out of bonds, should return the day', () => {
      const date = new Date();
      for (const day of [-1, 7]) {
        expect(mapWeekdayToString(day)).toEqual(day);
      }
    });
  });
});
