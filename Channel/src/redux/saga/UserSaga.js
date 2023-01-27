import { takeLatest } from "redux-saga/effects";
import { getUserDetails } from "../actions/user/userAction";
import * as Actions from '../Enums';

function* UserSaga() {
    yield takeLatest(Actions.SAVETOKEN,getUserDetails)
}

export default UserSaga;
