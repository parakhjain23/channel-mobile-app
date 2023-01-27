import * as Actions from "../../Enums";

const initialState = {
    channels : [],
    isLoading : false,
    accessToken : null,
    orgId : null
  };
  
  export function channelsReducer(state = initialState, action) {
    switch (action.type) {
      case Actions.SAVETOKEN : 
        return {...state, accessToken : action.accessToken , orgId : action.orgId }
      case Actions.FETCH_CHANNELS_START:
        return {...state,channels: [] , isLoading : true  }
      case Actions.FETCH_CHANNELS_SUCCESS :
        return {...state,channels:[],isLoading : false}
      case Actions.FETCH_CHANNELS_ERROR :
        return {...state,channels:[],isLoading: false}
      default:
        return state;
    }
  }
  