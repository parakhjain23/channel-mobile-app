import {take, takeLatest} from 'redux-saga/effects';
import {
  getChannelDetails,
  getChannels,
  resetUnreadCount,
} from '../actions/channels/ChannelsAction';
import {getChannelsByQuery} from '../actions/channels/ChannelsByQueryAction';
import {createNewChannel} from '../actions/channels/CreateNewChannelAction';
import {createNewDmChannel} from '../actions/channels/CreateNewDmChannelAction';
import {getChannelByTeamId} from '../actions/channels/GetChannelByTeamId';
import {getRecentChannels} from '../actions/channels/RecentChannelsAction';
import {getAllUsersOfOrg} from '../actions/org/GetAllUsersOfOrg';
import * as Actions from '../Enums';
import {closeChannel} from '../actions/channels/CloseChannelActions';
import {
  addUserToChannel,
  removeUserFromChannel,
} from '../actions/channelActivities/inviteUserToChannelAction';
import {joinChannel} from '../actions/channels/JoinChannelActions';

function* ChannelSaga() {
  yield takeLatest(Actions.FETCH_CHANNELS_START, getChannels);
  yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID, getChannels);
  yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID, getChannelDetails);
  yield takeLatest(Actions.FETCH_CHANNELS_START, getChannelDetails);
  yield takeLatest(Actions.UPDATE_CURRENT_ORG_ID, getAllUsersOfOrg);
  yield takeLatest(Actions.GET_ALL_USERS_START, getAllUsersOfOrg);
  yield takeLatest(Actions.CREATE_NEW_CHANNEL_START, createNewChannel);
  yield takeLatest(Actions.FETCH_CHANNELS_BY_QUERY_START, getChannelsByQuery);
  yield takeLatest(Actions.CREATE_NEW_DM_CHANNEL_START, createNewDmChannel);
  yield takeLatest(Actions.FETCH_CHANNELS_SUCCESS, getRecentChannels);
  yield takeLatest(Actions.RESET_UNREAD_COUNT_START, resetUnreadCount);
  yield takeLatest(Actions.GET_CHANNEL_START, getChannelByTeamId);
  yield takeLatest(Actions.CLOSE_CHANNEL_START, closeChannel);
  yield takeLatest(Actions.ADD_USER_TO_CHANNEL, addUserToChannel);
  yield takeLatest(Actions.REMOVE_USER_FROM_CHANNEL, removeUserFromChannel);
  yield takeLatest(Actions.JOIN_CHANNEL_START, joinChannel);
}

export default ChannelSaga;
