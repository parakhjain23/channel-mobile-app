import {put, call} from 'redux-saga/effects';
import { getAllUsersOfOrgApi } from '../../../api/getAllUsersofOrgApi/getAllUsers';
import * as Actions from '../../Enums';

export function* getAllUsersOfOrg({accessToken,orgId}){
  try {
    var response = yield call(getAllUsersOfOrgApi,accessToken,orgId)
    yield put(getAllUsersOfOrgSuccess(response))
  } catch (error) {
    console.warn(error);
  }
}
export function getAllUsersOfOrgStart(accessToken,orgId){
  return {
    type: Actions.GET_ALL_USERS_START,
    accessToken,orgId
  }
}
export function getAllUsersOfOrgSuccess(data){
  return {
    type: Actions.GET_ALL_USERS_SUCCESS,
    allUser : data,
  }
}

export function newUserJoinedAOrg(data){
  return {
    type: Actions.NEW_USER_JOINED_ORG,
    user : data,
  }
}

