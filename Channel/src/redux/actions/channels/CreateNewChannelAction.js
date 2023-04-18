import {call, put} from 'redux-saga/effects';
import {createChannel} from '../../../api/channelsApi/CreateChannel';
import * as Actions from '../../Enums';

export function* createNewChannel({
  token,
  orgId,
  channelName,
  channelType,
  userIds,
}) {
  try {
    yield call(createChannel, token, orgId, channelName, channelType, userIds);
  } catch (error) {
    console.warn(error);
  }
}

export function createNewChannelStart(
  token,
  orgId,
  channelName,
  channelType,
  userIds,
) {
  return {
    type: Actions.CREATE_NEW_CHANNEL_START,
    token,
    orgId,
    channelName,
    channelType,
    userIds,
  };
}
export function createNewChannelSuccess(data, userId) {
  return {
    type: Actions.CREATE_NEW_CHANNEL_SUCCESS,
    channel: data,
    userId,
  };
}
