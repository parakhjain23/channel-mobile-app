import * as Actions from '../../Enums';

const initialState = {
  isInternetConnected: false,
};

export function networkReducer(state = initialState, action) {

  switch (action.type) {
    case Actions.NETWORK_STATUS:
      return {...state, isInternetConnected: action.status};

    default:
      return state;
  }
}
