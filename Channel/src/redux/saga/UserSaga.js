import { takeLatest } from "redux-saga/effects";
import { getUserDetails } from "../actions/user/userAction";
import * as Actions from '../Enums';

function* UserSaga() {
    yield takeLatest(Actions.SAVE_TOKEN_AND_ORGID,getUserDetails)
}

export default UserSaga;
