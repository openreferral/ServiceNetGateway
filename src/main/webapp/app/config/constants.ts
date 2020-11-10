import _ from 'lodash';

const config = {
  VERSION: process.env.VERSION
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const AUTHORITIES = {
  SACRAMENTO: 'ROLE_SACRAMENTO',
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER'
};

export const SYSTEM_ACCOUNTS = {
  SERVICE_PROVIDER: 'ServiceProvider'
};

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error'
};

export const APP_DATE_FORMAT = 'MM/DD/YY HH:mm';
export const APP_DATE_12_HOUR_FORMAT = 'MM/DD/YY hh:mm a';
export const APP_TIMESTAMP_FORMAT = 'MM/DD/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'MM/DD/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
export const GOOGLE_API_KEY = _.get(window, '_env_.GOOGLE_API_KEY', '');
export const RECAPTCHA_SITE_KEY = _.get(window, '_env_.RECAPTCHA_SITE_KEY', '');
export const MAX_PAGE_SIZE = 2147483647;
export const MS_IN_A_DAY = 24 * 60 * 60 * 1000;

export const MEDIUM_WIDTH_BREAKPOINT = 991;
export const LARGE_WIDTH_BREAKPOINT = 992;
export const MOBILE_WIDTH_BREAKPOINT = 768;
export const DESKTOP_WIDTH_BREAKPOINT = 769;

// overridden component styles
const PLACEHOLDER_TEXT_COLOR = '#8e8e8e';
export const selectStyle = () => ({
  placeholder: style => ({ ...style, color: PLACEHOLDER_TEXT_COLOR })
});
