export const ACTION_TYPES = {
  SET_TEXT: 'search/SET_TEXT',
  RESET_TEXT: 'search/RESET_TEXT'
};

export const initialState = {
  text: ''
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
