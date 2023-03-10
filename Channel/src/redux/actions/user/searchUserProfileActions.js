import { call, put } from "redux-saga/effects";
import { getUserDetailsApi, searchUserProfileApi } from "../../../api/userDetailsApi/UserDetailsApi";
import * as Actions from "../../Enums";

export function* fetchSearchedUserProfile({userId,accessToken}){
    try {
        var response = yield call(searchUserProfileApi,userId,accessToken)
        yield put(fetchSearchedUserProfileSuccess(response))
    } catch (error) {
        console.warn(error);
    }
}

export function fetchSearchedUserProfileStart(userId,accessToken){
    return {
        type: Actions.SEARCH_USER_PROFILE_START,
        userId : userId ,
        accessToken : accessToken,
    }
}

export function fetchSearchedUserProfileSuccess(profile){
    return {
        type: Actions.SEARCH_USER_PROFILE_SUCCESS,
        data : profile
    }
}

