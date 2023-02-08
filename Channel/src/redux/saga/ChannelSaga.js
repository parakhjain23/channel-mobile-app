import { takeLatest } from "redux-saga/effects";
import { getChannels } from "../actions/channels/ChannelsAction";
import { getChannelsByQuery } from "../actions/channels/ChannelsByQueryAction";
import { createNewChannel } from "../actions/channels/CreateNewChannelAction";
import { getAllUsersOfOrg } from "../actions/org/GetAllUsersOfOrg";
import * as Actions from '../Enums';

function* ChannelSaga() {
    yield takeLatest(Actions.FETCH_CHANNELS_START,getChannels)
    yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID,getChannels)
    yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID,getAllUsersOfOrg)
    yield takeLatest(Actions.CREATE_NEW_CHANNEL_START,createNewChannel)
    yield takeLatest(Actions.FETCH_CHANNELS_BY_QUERY_START,getChannelsByQuery)
}

export default ChannelSaga;
