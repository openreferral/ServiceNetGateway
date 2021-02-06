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

export const GA_CATEGORIES = {
  LANDING_PAGE: 'Landing Page User Actions',
  LOGGED_IN: 'Logged In User Actions',
  LOGGED_IN_SP: 'Logged In Service Provider Actions',
  PUBLIC_VIEW: 'Public View User Actions',
  SEARCH: 'Search'
};

export const GA_ACTIONS = {
  LOG_IN: { category: GA_CATEGORIES.LANDING_PAGE, action: 'Log in' },
  FORGOT_PASSWORD: { category: GA_CATEGORIES.LANDING_PAGE, action: 'Forgot Password' },
  REMEMBER_ME: { category: GA_CATEGORIES.LANDING_PAGE, action: 'Remember Me' },
  REGISTER_ON_LOG_IN: { category: GA_CATEGORIES.LANDING_PAGE, action: 'Register on Log In' },
  REGISTER: { category: GA_CATEGORIES.LANDING_PAGE, action: 'Register' },
  LOG_OUT: { category: GA_CATEGORIES.LOGGED_IN, action: 'Log out' },
  SEARCHING_RECORDS: { category: GA_CATEGORIES.LOGGED_IN, action: 'Searching Records' },
  SERVICE_TYPE: { category: GA_CATEGORIES.LOGGED_IN, action: 'Service Type' },
  LOCATION_CITY: { category: GA_CATEGORIES.LOGGED_IN, action: 'Location City' },
  LOCATION_COUNTY: { category: GA_CATEGORIES.LOGGED_IN, action: 'Location County' },
  LOCATION_ZIP_CODE: { category: GA_CATEGORIES.LOGGED_IN, action: 'Location ZIP Code' },
  SORT_RECENTLY_UPDATED: { category: GA_CATEGORIES.LOGGED_IN, action: 'Sort Recently Updated' },
  SORT_ALPHABETICAL: { category: GA_CATEGORIES.LOGGED_IN, action: 'Sort Alphabetical ' },
  FILTER_VARIATION_SERVICE_TYPE_CITY: { category: GA_CATEGORIES.LOGGED_IN, action: 'Filter Variation (service type + city)' },
  FILTER_VARIATION_SERVICE_TYPE_COUNTY: { category: GA_CATEGORIES.LOGGED_IN, action: 'Filter Variation (service type + county)' },
  FILTER_VARIATION_SERVICE_TYPE_ZIP_CODE: { category: GA_CATEGORIES.LOGGED_IN, action: 'Filter Variation (service type + ZIP Code)' },
  CLEAR_FILTERS: { category: GA_CATEGORIES.LOGGED_IN, action: 'Clear Filters' },
  MAP_VIEW: { category: GA_CATEGORIES.LOGGED_IN, action: 'Map View' },
  MAP_VIEW_BACK_TO_GRID: { category: GA_CATEGORIES.LOGGED_IN, action: 'Map View back to grid' },
  CLICKING_ON_RECORDS: { category: GA_CATEGORIES.LOGGED_IN, action: 'Clicking on Records' },
  RECORD_WEBSITE_CLICK: { category: GA_CATEGORIES.LOGGED_IN, action: 'Record Website Click' },
  RECORD_SERVICE_DETAILS: { category: GA_CATEGORIES.LOGGED_IN, action: 'Record Service Details' },
  RECORD_LOCATION_DIRECTIONS: { category: GA_CATEGORIES.LOGGED_IN, action: 'Record Location Directions' },
  CHECK_IN_PHONE: { category: GA_CATEGORIES.LOGGED_IN, action: 'Check In (Phone #)' },
  CHECK_IN_SN_ID: { category: GA_CATEGORIES.LOGGED_IN, action: 'Check In (SN ID)' },
  REFERRAL_PHONE: { category: GA_CATEGORIES.LOGGED_IN, action: 'Referral (Phone #)' },
  REFERRAL_SN_ID: { category: GA_CATEGORIES.LOGGED_IN, action: 'Referral (SN ID)' },
  PASSWORD: { category: GA_CATEGORIES.LOGGED_IN, action: 'Password' },
  ADD_A_NEW_RECORD: { category: GA_CATEGORIES.LOGGED_IN_SP, action: 'Add a new record' },
  CLAIM_RECORDS_CLAIM_MORE_RECORDS_POP_UP_YES: {
    category: GA_CATEGORIES.LOGGED_IN_SP,
    action: 'Claim Record(s) (claim more records pop up yes)'
  },
  CLAIM_RECORDS_CLAIM_MORE_RECORDS_POP_UP_NO: {
    category: GA_CATEGORIES.LOGGED_IN_SP,
    action: 'Claim Record(s) (claim more records pop up no)'
  },
  EDIT_RECORD: { category: GA_CATEGORIES.LOGGED_IN_SP, action: 'Edit Record' },
  RECORD_DAILY_UPDATE: { category: GA_CATEGORIES.LOGGED_IN_SP, action: 'Record daily Update' },
  DEACTIVATED_ACCOUNTS: { category: GA_CATEGORIES.LOGGED_IN_SP, action: 'Deactivated Accounts' },
  PUBLIC_SEARCHING_RECORDS: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Searching Records' },
  PUBLIC_SERVICE_TYPE: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Service Type' },
  PUBLIC_LOCATION_CITY: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Location City' },
  PUBLIC_LOCATION_COUNTY: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Location County' },
  PUBLIC_LOCATION_ZIP_CODE: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Location ZIP Code' },
  PUBLIC_SORT_RECENTLY_UPDATED: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Sort Recently Updated' },
  PUBLIC_SORT_ALPHABETICAL: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Sort Alphabetical ' },
  PUBLIC_FILTER_VARIATION_SERVICE_TYPE_CITY: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Filter Variation (service type + city)' },
  PUBLIC_FILTER_VARIATION_SERVICE_TYPE_COUNTY: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Filter Variation (service type + county)' },
  PUBLIC_FILTER_VARIATION_SERVICE_TYPE_ZIP_CODE: {
    category: GA_CATEGORIES.PUBLIC_VIEW,
    action: 'Filter Variation (service type + ZIP Code)'
  },
  PUBLIC_CLEAR_FILTERS: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Clear Filters' },
  PUBLIC_MAP_VIEW: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Map View' },
  PUBLIC_MAP_VIEW_BACK_TO_GRID: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Map View back to grid' },
  PUBLIC_CLICKING_ON_RECORDS: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Clicking on Records' },
  PUBLIC_RECORD_WEBSITE_CLICK: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Record Website Click' },
  PUBLIC_RECORD_SERVICE_DETAILS: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Record Service Details' },
  PUBLIC_RECORD_LOCATION_DIRECTIONS: { category: GA_CATEGORIES.PUBLIC_VIEW, action: 'Record Location Directions' },
  SEARCH_TERM: { category: GA_CATEGORIES.SEARCH, action: 'Search term' }
};
