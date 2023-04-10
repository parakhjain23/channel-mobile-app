import { call, put } from 'redux-saga/effects';
import { getChannelByTeamIdApi } from '../../../api/channelsApi/GetChannelByTeamId';
import * as Actions from '../../Enums';

export function* getChannelByTeamId({token,teamId,userId}){
    try {
      const response = yield call(getChannelByTeamIdApi,token,teamId)
      if(response.purpose == 'SpaceBot'){
        yield put(gotSpaceBot(response))
      }else{
        yield put(getChannelByTeamIdSuccess(response,userId))
      }
    } catch (error) {
      console.warn(error);
    }
  }

export function getChannelByTeamIdStart(token,teamId,userId){
  // console.warn("inside start");
  return {
    type: Actions.GET_CHANNEL_START,
    token,teamId,userId
  }
}
export function getChannelByTeamIdSuccess(channel,userId){
  // console.warn("inside successs",channel);
    return {
      type: Actions.GET_CHANNEL_SUCCESS,
      channel,
      userId
    }
  }
export function gotSpaceBot(response){
  return null
} 