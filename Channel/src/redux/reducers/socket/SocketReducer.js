import { State } from "react-native-gesture-handler";
import * as Actions from "../../Enums"
import { INITIALIZE_SOCKET } from "../../SocketEnums";
const initialState = {
  socket : null,
  needToCloseAndReconnectSocket : false
};

export function socketReducer(state = initialState, action) {
  switch (action.type) {
    case 'SOCKET_CREATED' :
      return {...state,socket : action.socket}

    case  Actions.UPDATE_CURRENT_ORG_ID :
      return {...state, needToCloseAndReconnectSocket : true}
    
      case INITIALIZE_SOCKET :
      return {...state, needToCloseAndReconnectSocket : false}  
    default:
      return state;
  }
}
