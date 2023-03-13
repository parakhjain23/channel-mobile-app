import * as Actions from "../../Enums";

const initialState = {
  user: null,
  isLoading: true,
  isSignedIn: false,
  accessToken: null,
  searchedUserProfile : null
};

export function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SAVE_TOKEN_AND_ORGID:
      return {...state,accessToken:action.accessToken ,isSignedIn:true}
    
    case Actions.FETCH_USER_DETAILS_SUCCESS:
      return {...state, user : action.userDetails}

    case Actions.SIGN_OUT:
      return {initialState};
    case Actions.SEARCH_USER_PROFILE_START:
      return{...state,searchedUserProfile:null}
    case Actions.SEARCH_USER_PROFILE_SUCCESS:
      return{...state,searchedUserProfile:action?.data}
    default:
      return state;
  }
}
