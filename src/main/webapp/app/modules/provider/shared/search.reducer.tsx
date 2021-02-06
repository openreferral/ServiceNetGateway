export const ACTION_TYPES = {
  SET_TEXT: 'search/SET_TEXT',
  RESET_TEXT: 'search/RESET_TEXT',
  SET_TEXT_MODAL: 'search/SET_TEXT_MODAL',
  RESET_TEXT_MODAL: 'search/RESET_TEXT_MODAL'
};

export const initialState = {
  text: '',
  textModal: ''
};

export type SearchState = Readonly<typeof initialState>;

export default (state: SearchState = initialState, action): SearchState => {
  switch (action.type) {
    case ACTION_TYPES.SET_TEXT:
      return {
        ...state,
        text: action.text
      };
    case ACTION_TYPES.RESET_TEXT:
      return {
        ...state,
        text: initialState.text
      };
    case ACTION_TYPES.SET_TEXT_MODAL:
      return {
        ...state,
        textModal: action.text
      };
    case ACTION_TYPES.RESET_TEXT_MODAL:
      return {
        ...state,
        textModal: initialState.textModal
      };
    default:
      return state;
  }
};

export const setText = text => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_TEXT,
    text
  });
};

export const resetText = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.RESET_TEXT
  });
};

export const setTextModal = text => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_TEXT_MODAL,
    text
  });
};

export const resetTextModal = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.RESET_TEXT_MODAL
  });
};
