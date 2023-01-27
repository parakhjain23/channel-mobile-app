import {put, call} from 'redux-saga/effects';
import { getChannelsApi } from '../../../api/channelsApi/getChannels';
import * as Actions from '../../Enums';

export function* getChannels({token,orgId}){
  try {
    var response = yield call(getChannelsApi,token,orgId) 
    yield put(getChannelsSuccess(response))
  } catch (error) {
    console.log(error);
  }
}

export function getChannelsStart(token,orgId){
  return {
    type: Actions.FETCH_CHANNELS_START,
    token:token,
    orgId:orgId
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