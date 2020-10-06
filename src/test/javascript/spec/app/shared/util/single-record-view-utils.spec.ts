import { getTextAreaField, getTextField } from 'app/shared/util/single-record-view-utils';

describe('Single Record View utils', () => {
  const FIELD_NAME = 'some field';
  const VALUE = 'some value';

  describe('getTextField', () => {
    it('should return correct type', () => {
      expect(getTextField(null, null).type).toEqual(
        'text'
      );
    });
    it('should include field name', () => {
      expect(getTextField(null, FIELD_NAME).fieldName).toEqual(
        FIELD_NAME
      );
    });
    it('default value should equal to the selected field', () => {
      const obj = {};
      obj[FIELD_NAME] = VALUE;
      expect(getTextField(obj, FIELD_NAME).defaultValue).toEqual(
        VALUE
      );
    });
    it('default value should be empty if there is no object', () => {
      expect(getTextField(null, FIELD_NAME).defaultValue).toEqual(
        ''
      );
    });
  });
  describe('getTextAreaField', () => {
    it('should return correct type', () => {
      expect(getTextAreaField(null, null).type).toEqual(
        'textarea'
      );
    });
    it('should include field name', () => {
      expect(getTextAreaField(null, FIELD_NAME).fieldName).toEqual(
        FIELD_NAME
      );
    });
    it('default value should equal to the selected field', () => {
      const obj = {};
      obj[FIELD_NAME] = VALUE;
      expect(getTextAreaField(obj, FIELD_NAME).defaultValue).toEqual(
        VALUE
      );
    });
    it('default value should be empty if there is no object', () => {
      expect(getTextAreaField(null, FIELD_NAME).defaultValue).toEqual(
        ''
      );
    });
  });
});
