import {call, put} from 'redux-saga/effects';
import {createChannel} from '../../../api/channelsApi/CreateChannel';
import {createDmChannel} from '../../../api/channelsApi/CreateDmChannel';
import * as Actions from '../../Enums';

export function* createNewDmChannel({
  token,
  orgId,
  channelName,
  reciverUserId,
}) {
  try {
    var response = yield call(
      createDmChannel,
      token,
      orgId,
      channelName,
      reciverUserId,
    );
  } catch (error) {
    console.warn(error);
  }
}

export function createNewDmChannelStart(
  token,
  orgId,
  channelName,
  reciverUserId,
) {
  return {
    type: Actions.CREATE_NEW_DM_CHANNEL_START,
    token,
    orgId,
    channelName,
    reciverUserId,
  };
}
