import {put, call} from 'redux-saga/effects';
import { getAllUsersOfOrgApi } from '../../../api/getAllUsersofOrgApi/getAllUsers';
import * as Actions from '../../Enums';

export function* getAllUsersOfOrg({accessToken,orgId}){
  try {
    var response = yield call(getAllUsersOfOrgApi,accessToken,orgId)
    yield put(getAllUsersOfOrgSuccess(response))
  } catch (error) {
    console.log(error);
  }
}

export function getAllUsersOfOrgSuccess(data){
  return {
    type: Actions.GET_ALL_USERS_SUCCESS,
    allUser : data,
  }
}