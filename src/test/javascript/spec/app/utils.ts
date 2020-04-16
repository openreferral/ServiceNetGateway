// A dirty way to remove functions and undefined from an object for comparison
import thunk from 'redux-thunk';
import axios from 'axios';
import { setLocale } from 'app/shared/reducers/locale';
import { TranslatorContext } from 'react-jhipster';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

export const cleanupObj = obj => JSON.parse(JSON.stringify(obj));

export function setupTranslations() {
  const store = configureStore([thunk])({});
  axios.get = sinon.stub().returns(Promise.resolve({ key: 'value' }));
  store.dispatch(setLocale(TranslatorContext.context.defaultLocale));
}
