const initialState = {
  user: null,
  guest: false,
  isLoading: true,
  isAuthticated: false,
  signedIn: false,
  accessToken: null
};

export function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case "SAVETOKEN":
      return {...state,accessToken:action.payload}
    default:
      return state;
  }
}
