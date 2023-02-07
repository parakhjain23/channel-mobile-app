import {put, call} from 'redux-saga/effects';
import { getMessagesOfTeamApi } from '../../../api/messages/getMessagesOfTeamApi';
import { sendMessageApi } from '../../../api/messages/sendMessageApi';
import * as Actions from '../../Enums';
import { moveChannelToTop } from '../channels/ChannelsAction';

export function* getChats({teamId,token,skip}){
  try {
    var response = yield call(getMessagesOfTeamApi,teamId,token,skip) 
    yield put(getChatsSuccess(response,teamId))
  } catch (error) {
    console.log(error);
  }
}

export function getChatsStart(teamId,token,skip){
  return {
    type: Actions.FETCH_CHAT_START,
    teamId,
    token,skip
  }
}
export function getChatsSuccess(data,teamId){
  return {
    type: Actions.FETCH_CHAT_SUCCESS,
    teamId: teamId,
    messages: data.messages,
    parentMessages : data.parentMessages
  }
}
export function getChatsError(){
    return {
        type:Actions.FETCH_CHAT_ERROR
    }
}

export function* sendMessage({message,teamId,orgId,senderId,token,parentId}){
  try {
    yield call(sendMessageApi,message,teamId,orgId,senderId,token,parentId)
    yield put(moveChannelToTop(teamId))
  } catch (error) {
    console.log(error);
  }
}
export function sendMessageStart(message,teamId,orgId,senderId,token,parentId){
  return {
    type: Actions.SEND_MESSAGE_START,
    message,teamId,orgId,senderId,token,parentId
  }
}

export function addNewMessage(message){
  return {
    type: Actions.ADD_NEW_MESSAGE,
    teamId: message?.teamId,
    message : message,
    parentMessage : message?.parentMessage
  }
}