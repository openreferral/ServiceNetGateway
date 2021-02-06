import { sendAction } from 'app/shared/util/analytics';

const TRACKED_ACTIONS = {
  // this could be automatic, we are tracking clicks rather than actions
  // [REQUEST(AUTH_ACTIONS.LOGOUT)]: GA_ACTIONS.LOG_OUT
};

export default () => next => action => {
  const trackedAction = TRACKED_ACTIONS[action.type];

  if (trackedAction) {
    sendAction(trackedAction);
  }

  return next(action);
};
