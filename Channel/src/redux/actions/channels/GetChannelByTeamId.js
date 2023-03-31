import { call, put } from 'redux-saga/effects';
import { getChannelByTeamIdApi } from '../../../api/channelsApi/GetChannelByTeamId';
import * as Actions from '../../Enums';

export function* getChannelByTeamId({token,teamId,userId}){
    try {
      const response = yield call(getChannelByTeamIdApi,token,teamId)
      yield put(getChannelByTeamIdSuccess(response,userId))
    } catch (error) {
      console.warn(error);
    }
  }

export function getChannelByTeamIdStart(token,teamId,userId){
  return {
    type: Actions.GET_CHANNEL_START,
    token,teamId,userId
  }
}
export function getChannelByTeamIdSuccess(channel,userId){
    return {
      type: Actions.GET_CHANNEL_SUCCESS,
      channel,
      userId
    }
  }