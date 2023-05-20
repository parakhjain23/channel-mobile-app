import * as Actions from '../../Enums';
const initialState = {
  appVersion: null,
};

export function appInfoReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.UPDATE_APP_VERSION:
      return {
        ...state,
        appVersion: action?.version,
      };
    case Actions.SET_DEVICE_TYPE:
      return {
        ...state,
        deviceType: action?.deviceType,
      };
    default:
      return state;
  }
}
