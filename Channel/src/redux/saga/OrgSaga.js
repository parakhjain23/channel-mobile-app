import { takeLatest } from "redux-saga/effects";
import * as Actions from '../Enums';
import { getOrgDetails } from "../actions/org/GetOrgDetailsAction";

function* OrgSaga() {
    yield takeLatest(Actions.GET_ORG_START, getOrgDetails)
}

export default OrgSaga;
