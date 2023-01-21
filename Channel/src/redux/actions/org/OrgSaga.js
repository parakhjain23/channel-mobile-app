import { takeLatest } from "redux-saga/effects";
import * as Actions from '../../Enums';
import { getOrgDetails } from "./GetOrgDetails";

function* OrgSaga() {
    yield takeLatest(Actions.GET_ORG_START,getOrgDetails())
}

export default OrgSaga;
