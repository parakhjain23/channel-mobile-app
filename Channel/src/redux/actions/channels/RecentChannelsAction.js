import { call, put } from 'redux-saga/effects';
import { getRecenctChannelsApi } from '../../../api/channelsApi/GetRecentChannelsApi';
import * as Actions from '../../Enums';

export function* getRecentChannels({accessToken,orgId,userId}){
    try {
      var response = yield call(getRecenctChannelsApi,accessToken,orgId,userId)
      yield put(getRecentChannelsSuccess(response))
    } catch (error) {
      console.warn(error);
    }
  }

export function getRecentChannelsSuccess(response){
  return {
    type: Actions.FETCH_RECENT_CHANNELS_SUCCESS,
    recentChannels: response
  }
}
