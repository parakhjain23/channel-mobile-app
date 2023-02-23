import { State } from "react-native-gesture-handler";
import * as Actions from "../../Enums"
import { INITIALIZE_SOCKET, SOCKET_STATUS } from "../../SocketEnums";
import * as SocketAction from "../../SocketEnums"
const initialState = {
  isSocketConnected: false
};

export function socketReducer(state = initialState, action) {
  switch (action.type) {
    case SocketAction.SOCKET_STATUS :
      return {...state,isSocketConnected : action.status}
    default:
      return state;
  }
}
