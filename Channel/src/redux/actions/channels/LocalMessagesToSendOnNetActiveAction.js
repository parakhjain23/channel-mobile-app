import { call, put } from 'redux-saga/effects';
import * as Actions from '../../Enums';

// export function* createNewDmChannel({token,orgId,channelName,reciverUserId}){
//     try {
//       var response = yield call(createDmChannel,token,orgId,channelName,reciverUserId)
//     } catch (error) {
//       console.log(error);
//     }
//   }

export function addLocalMessageToSendOnNetAvailable(data){
    console.log(data,"this is message in actions");
  return {
    type: Actions.LOCAL_MESSAGE_TO_SAVE_IN_STATE,
    data
  }
}

export function removeLocalMessageFromState(data){
  console.log(data,"this is message REMOVE in actions");
return {
  type: Actions.REMOVE_LOCAL_MESSAGE_FROM_STATE,
  data
}
}

