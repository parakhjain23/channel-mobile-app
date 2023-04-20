import {put, call} from 'redux-saga/effects';
import { fetchOrgsApi } from '../../../api/getOrgsApi/GetOrgs';
import * as Actions from '../../Enums';

export function* getOrgDetails({accessToken}){
  try {
    var response = yield call(fetchOrgsApi, accessToken)
    if(response?.length == 0){
      yield put(noOrgsFound())
    }else{
      yield put(getOrgDetailsSuccess(response))
    }
  } catch (error) {
    console.warn(error);
  }
}

export function getOrgDetailsStart(token){
  return {
    type: Actions.GET_ORG_START,
    accessToken : token
  }
}
export function getOrgDetailsSuccess(data){
  return {
    type: Actions.GET_ORG_SUCCESS,
    payload : data,
  }
}
export function getOrgDetailsReset(){
    return {
        type:Actions.GET_ORG_RESET
    }
}

export function noOrgsFound(){
  return{
    type:Actions.NO_ORGS_FOUND
  }
}