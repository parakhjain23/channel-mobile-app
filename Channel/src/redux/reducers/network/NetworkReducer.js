import * as Actions from '../../Enums';

const initialState = {
    isNetConnected : false
};

export function networkReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.NETWORK_STATUS:
      console.log(action,"this is net status");
        return{...state, isNetConnected : action.data}
    default:
      return state;
  }
}
