import * as Actions from "../../Enums";


const initialState = {
  user: null,
  guest: false,
  isLoading: true,
  isAuthticated: false,
  isSignedIn: false,
  accessToken: null,
  orgId:null
};

export function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SAVETOKEN:
      return {...state,accessToken:action.accessToken,orgId : action.orgId,isSignedIn:true}
    default:
      return state;
  }
}
