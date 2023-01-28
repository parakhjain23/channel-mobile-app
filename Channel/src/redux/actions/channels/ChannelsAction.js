import {put, call} from 'redux-saga/effects';
import { getChannelsApi } from '../../../api/channelsApi/getChannels';
import * as Actions from '../../Enums';

export function* getChannels({accessToken,orgId,userId}){
  try {
    var response = yield call(getChannelsApi,accessToken,orgId,userId) 
    yield put(getChannelsSuccess(response))
  } catch (error) {
    console.log(error);
  }
}

export function getChannelsStart(token,orgId,userId){
  return {
    type: Actions.FETCH_CHANNELS_START,
    accessToken:token,
    orgId:orgId,
    userId:userId
  }
}
export function getChannelsSuccess(data){
  return {
    type: Actions.FETCH_CHANNELS_SUCCESS,
    channels:data
  }
}
export function getChannelsError(){
    return {
        type:Actions.FETCH_CHANNELS_ERROR
    }
}