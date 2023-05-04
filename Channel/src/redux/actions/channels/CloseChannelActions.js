import { call, put } from 'redux-saga/effects';
import { closeChannelApi } from '../../../api/channelsApi/CloseChannelApi';
import * as Actions from '../../Enums';

export function* closeChannel({name,teamId,channelType,accessToken}) {
    try {
      var response = yield call(
        closeChannelApi,
        name,teamId,channelType,accessToken
      );
    } catch (error) {
      console.warn(error);
    }
  }
  export function closeChannelStart(name,teamId,channelType,accessToken){
    return {
      type: Actions.CLOSE_CHANNEL_START,
      name: name, teamId: teamId, channelType: channelType, accessToken: accessToken
    };
  }
  export function closeChannelSuccess(teamId) {
    return {
      type: Actions.CLOSE_CHANNEL_SUCCESS,
      teamId: teamId,
    };
  }