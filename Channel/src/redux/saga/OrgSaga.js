import { takeLatest } from "redux-saga/effects";
import * as Actions from '../Enums';
import { getOrgDetails } from "../actions/org/GetOrgDetails";

function* OrgSaga() {
    yield takeLatest(Actions.GET_ORG_START,getOrgDetails())
}

export default OrgSaga;
