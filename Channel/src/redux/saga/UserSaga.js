import { takeLatest } from "redux-saga/effects";
import { getAllUsersOfOrg } from "../actions/org/GetAllUsersOfOrg";
import { getUserDetails } from "../actions/user/userAction";
import * as Actions from '../Enums';

function* UserSaga() {
    yield takeLatest(Actions.SAVE_TOKEN_AND_ORGID,getUserDetails)
    yield takeLatest(Actions.SAVE_TOKEN_AND_ORGID,getAllUsersOfOrg)
}

export default UserSaga;
