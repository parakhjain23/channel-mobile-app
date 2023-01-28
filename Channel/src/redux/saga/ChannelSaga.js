import { takeLatest } from "redux-saga/effects";
import { getChannels } from "../actions/channels/ChannelsAction";
import { getAllUsersOfOrg } from "../actions/org/GetAllUsersOfOrg";
import * as Actions from '../Enums';

function* ChannelSaga() {
    yield takeLatest(Actions.FETCH_CHANNELS_START,getChannels)
    yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID,getChannels)
    yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID,getAllUsersOfOrg)
}

export default ChannelSaga;
