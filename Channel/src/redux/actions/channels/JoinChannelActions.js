import {call, put} from 'redux-saga/effects';
import * as Actions from '../../Enums';
import {joinChannelApi} from '../../../api/channelsApi/JoinChannelApi';

export function* joinChannel({orgId, teamId, userId, accessToken}) {
  try {
    var response = yield call(
      joinChannelApi,
      orgId,
      teamId,
      userId,
      accessToken,
    );
    yield put(JoinChannelSuccess(userId, teamId));
  } catch (error) {
    console.warn(error);
  }
}
export function joinChannelStart(orgId, teamId, userId, accessToken) {
  return {
    type: Actions.JOIN_CHANNEL_START,
    orgId,
    teamId,
    userId,
    accessToken,
  };
}
export function JoinChannelSuccess(userId, teamId) {
  return {
    type: Actions.JOIN_CHANNEL_SUCCESS,
    userId,
    teamId,
  };
}
