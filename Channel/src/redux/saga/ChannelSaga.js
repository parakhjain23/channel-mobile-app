import { takeLatest } from "redux-saga/effects";
import { getChannels } from "../actions/channels/ChannelsAction";
import * as Actions from '../Enums';

function* ChannelSaga() {
    yield takeLatest(Actions.FETCH_CHANNELS_START,getChannels)
}

export default ChannelSaga;
