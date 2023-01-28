import { call, put } from "redux-saga/effects";
import { getUserDetailsApi } from "../../../api/userDetailsApi/UserDetailsApi";
import * as Actions from "../../Enums";

export function* getUserDetails({accessToken}){
    try {
        var response = yield call(getUserDetailsApi,accessToken)
        yield put(getUserDetailsSuccess(response))
    } catch (error) {
        console.log(error);
    }
}

export function saveUserToken(token,orgId){
    return {
        type: Actions.SAVE_TOKEN_AND_ORGID,
        accessToken : token,
        orgId : orgId 
    }
}

export function getUserDetailsSuccess(data){
    return {
        type: Actions.FETCH_USER_DETAILS_SUCCESS,
        userDetails: data
    }
}