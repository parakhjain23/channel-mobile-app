import * as Actions from '../../Enums';

const initialState = {
  isLoading: false,
  isInitiated: false,
  orgs: null,
};

export function orgsReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.GET_ORG_START:
      return {...state, isLoading: true, isInitiated: true};
    case Actions.GET_ORG_SUCCESS:
      return {...state, orgs: action.payload, isLoading: false};
    default:
      return state;
  }
}
