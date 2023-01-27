import {put, call} from 'redux-saga/effects';
import * as Actions from '../../Enums';

export function* getChannels({payLoad}){
  try {
    var response = yield call() 
    yield put(getChannelsSuccess(response))
  } catch (error) {
    console.log(error);
  }
}

export function getChannelsStart(payLoad){
  return {
    type: Actions.GET_ORG_START,
    payLoad : payLoad
  }
}
export function getChannelsSuccess(data){
  return {
    type: Actions.GET_ORG_SUCCESS,
    data : data,
    shopify_id: data.id,
  }
}
export function getChannelsError(){
    return {
        type:Actions.GET_ORG_RESET
    }
}