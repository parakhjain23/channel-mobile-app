import * as Actions from '../../Enums';

const initialState = {
  user: null,
  isLoading: false,
  isSignedIn: false,
  accessToken: null,
  searchedUserProfile: null,
  siginInMethod: '',
};

export function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SAVE_TOKEN:
      return {...state, accessToken: action.accessToken, isSignedIn: true};
    case Actions.SIGNIN_METHOD:
      return {...state, siginInMethod: action.signinMethod};
    case Actions.FETCH_USER_DETAILS_SUCCESS:
      return {...state, user: action.userDetails};

    case Actions.SIGN_OUT:
      return initialState;
    case Actions.SEARCH_USER_PROFILE_START:
      return {...state, searchedUserProfile: null, isLoading: true};
    case Actions.SEARCH_USER_PROFILE_SUCCESS:
      return {...state, searchedUserProfile: action?.data, isLoading: false};
    default:
      return state;
  }
}
