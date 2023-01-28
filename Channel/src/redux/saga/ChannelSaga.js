import { takeLatest } from "redux-saga/effects";
import { getChannels } from "../actions/channels/ChannelsAction";
import * as Actions from '../Enums';

function* ChannelSaga() {
    yield takeLatest(Actions.FETCH_CHANNELS_START,getChannels)
    yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID,getChannels)
}

export default ChannelSaga;
