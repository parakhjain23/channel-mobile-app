import { takeLatest } from "redux-saga/effects";
import * as Actions from '../Enums';
import { getOrgDetails } from "../actions/org/GetOrgDetailsAction";

function* NotificationSaga() {
    // yield takeLatest(Actions.SET_ACTIVE_CHANNEL_TEAMID)
}

export default NotificationSaga;
