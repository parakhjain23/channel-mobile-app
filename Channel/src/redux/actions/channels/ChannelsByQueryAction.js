import {put, call} from 'redux-saga/effects';
import { getChannelsByQueryApi } from '../../../api/channelsApi/GetChannelsByQueryApi';
import * as Actions from '../../Enums';

export function* getChannelsByQuery({query,userToken,orgId}){
  try {
    var response = yield call(getChannelsByQueryApi,query,userToken,orgId) 
    yield put(getChannelsByQuerySuccess(response))
  } catch (error) {
    console.warn(error);
  }
}

export function getChannelsByQueryStart(query,userToken,orgId){
  return {
    type: Actions.FETCH_CHANNELS_BY_QUERY_START,
    query,userToken,orgId
  }
}
export function getChannelsByQuerySuccess(data){
  return {
    type: Actions.FETCH_CHANNELS_BY_QUERY_SUCCESS,
    channels:data
  }
}
export function getChannelsByQueryError(){
    return {
        type:Actions.FETCH_CHANNELS_BY_QUERY_ERROR
    }
}


