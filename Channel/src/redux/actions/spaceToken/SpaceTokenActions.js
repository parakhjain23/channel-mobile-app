import { getSpaceAccessTokenApi } from "../../../api/spaceAccessTokenApi/SpaceAccessTokenApi";
import * as Actions from '../../Enums'
import {call, put} from 'redux-saga/effects';
import { getOrgDetailsStart } from "../org/GetOrgDetailsAction";


export function* getSpaceAccessToken({firebaseAccessToken}) {
    try {
      var response = yield call(getSpaceAccessTokenApi,firebaseAccessToken);
      yield put(saveUserToken(response));
      yield put(getOrgDetailsStart(response?.accessToken))
    } catch (error) {
      console.warn(error);
    }
  }
  export function getSpaceTokenStart(firebaseAccessToken) {
    return {
      type:Actions.GET_SPACE_TOKEN_START,
      firebaseAccessToken  
    };
  }
  export function saveUserToken(response) {
    return {
      type: Actions.SAVE_TOKEN,
      accessToken:response.accessToken,
    };
  }

  export function setSigningMethod(signinMethod){
    return{
      type:Actions.SIGNIN_METHOD,
      signinMethod
    }
  }