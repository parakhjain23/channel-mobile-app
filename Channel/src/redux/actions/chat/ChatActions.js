import {put, call} from 'redux-saga/effects';
import { getMessagesOfTeamApi } from '../../../api/messages/getMessagesOfTeamApi';
import { sendMessageApi } from '../../../api/messages/sendMessageApi';
import * as Actions from '../../Enums';

export function* getChats({teamId,token}){
  try {
    var response = yield call(getMessagesOfTeamApi,teamId,token) 
    yield put(getChatsSuccess(response,teamId))
  } catch (error) {
    console.log(error);
  }
}

export function getChatsStart(teamId,token){
  return {
    type: Actions.FETCH_CHAT_START,
    teamId,
    token
  }
}
export function getChatsSuccess(data,teamId){
  return {
    type: Actions.FETCH_CHAT_SUCCESS,
    teamId: teamId,
    payload: data
  }
}
export function getChatsError(){
    return {
        type:Actions.FETCH_CHAT_ERROR
    }
}

export function* sendMessage({message,teamId,orgId,senderId,token}){
  try {
    yield call(sendMessageApi,message,teamId,orgId,senderId,token)
  } catch (error) {
    console.log(error);
  }
}
export function sendMessageStart(message,teamId,orgId,senderId,token){
  return {
    type: Actions.SEND_MESSAGE_START,
    message,teamId,orgId,senderId,token
  }
}
