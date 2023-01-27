import {put, call} from 'redux-saga/effects';
import { fetchOrgsApi } from '../../../api/GetOrgs';
import * as Actions from '../../Enums';

export function* getOrgDetails({token}){
  try {
    var response = yield call(fetchOrgsApi, token)
    yield put(getOrgDetailsSuccess(response))
  } catch (error) {
    console.log(error);
  }
}

export function getOrgDetailsStart(token){
  return {
    type: Actions.GET_ORG_START,
    token : token
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