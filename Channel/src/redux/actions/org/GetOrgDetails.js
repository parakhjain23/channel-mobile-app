import {put, call} from 'redux-saga/effects';
import * as Actions from '../../Enums';

export function* getOrgDetails({payLoad}){
  try {
    var response = yield call() 
    yield put(fetchUserDetailsSuccess(response))
  } catch (error) {
    console.log(error);
  }
}

export function getOrgDetailsStart(payLoad){
  return {
    type: Actions.GET_ORG_START,
    payLoad : payLoad
  }
}
export function getOrgDetailsSuccess(data){
  return {
    type: Actions.GET_ORG_SUCCESS,
    data : data,
    shopify_id: data.id,
  }
}
export function getOrgDetailsReset(){
    return {
        type:Actions.GET_ORG_RESET
    }
}