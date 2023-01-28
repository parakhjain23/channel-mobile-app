import * as Actions from "../../Enums";

const initialState = {
    channels : [],
    isLoading : false,
  };
  
  export function channelsReducer(state = initialState, action) {
    switch (action.type) {

      case Actions.FETCH_CHANNELS_START:
        return {...state, isLoading : true }

      case Actions.UPDATE_CURRENT_ORG_ID:
        return {...state, isLoading : true}

      case Actions.FETCH_CHANNELS_SUCCESS :
        return {...state, channels: action.channels , isLoading : false}

      case Actions.FETCH_CHANNELS_ERROR :
        return {...state, channels:[], isLoading: false}
        
      default:
        return state;
    }
  }
  