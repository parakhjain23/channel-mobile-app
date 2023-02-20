import { call, put } from 'redux-saga/effects';
import { deleteMessageApi } from '../../../api/messages/deleteMessageApi';
import * as Actions from '../../Enums'
export function* deleteMessage({accessToken,msgId}){
    try {
      var response = yield call(deleteMessageApi,accessToken,msgId) 
    } catch (error) {
      console.warn(error);
    }
  }
  
  export function deleteMessageStart(accessToken,msgId){
    return {
      type: Actions.DELETE_MESSAGE_START,
        accessToken,msgId
    }
  }
  export function deleteMessageSuccess(response){
    return {
      type: Actions.DELETE_MESSAGE_SUCCESS,
      teamId : response?.teamId,
      msgIdToDelete : response?._id
    }
  }