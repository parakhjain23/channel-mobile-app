import {call, put} from 'redux-saga/effects';
import {getUserDetailsApi} from '../../../api/userDetailsApi/UserDetailsApi';
import * as Actions from '../../Enums';

export function* getUserDetails({accessToken}) {
  try {
    var response = yield call(getUserDetailsApi, accessToken);
    yield put(getUserDetailsSuccess(response));
  } catch (error) {
    console.warn(error);
  }
}

export function getUserDetailsSuccess(data) {
  return {
    type: Actions.FETCH_USER_DETAILS_SUCCESS,
    userDetails: data,
  };
}

export default function signOut() {
  return {
    type: Actions.SIGN_OUT,
  };
}
