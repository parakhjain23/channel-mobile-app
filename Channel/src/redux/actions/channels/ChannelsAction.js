import {put, call} from 'redux-saga/effects';
import {getChannelDetailsApi} from '../../../api/channelsApi/GetChannelDetailsApi';
import {getChannelsApi} from '../../../api/channelsApi/getChannels';
import {resetUnreadCountApi} from '../../../api/channelsApi/ResetUnreadCountApi';
import * as Actions from '../../Enums';

export function* getChannels({accessToken,orgId,userId,userName}){
  try {
    var response = yield call(getChannelsApi,accessToken,orgId,userId) 
    yield put(getChannelsSuccess(response,userId,accessToken,orgId,userName))
  } catch (error) {
    console.warn(error);
  }
}

export function getChannelsStart(token,orgId,userId,userName){
  return {
    type: Actions.FETCH_CHANNELS_START,
    accessToken:token,
    orgId:orgId,
    userId:userId,
    userName:userName
  }
}
export function getChannelsSuccess(data,userId,accessToken,orgId,userName){
  return {
    type: Actions.FETCH_CHANNELS_SUCCESS,
    channels:data,
    userId:userId,accessToken,orgId,userName
  }
}
export function getChannelsError() {
  return {
    type: Actions.FETCH_CHANNELS_ERROR,
  };
}

export function moveChannelToTop(channelId, senderId = '', userId = '') {
  return {
    type: Actions.MOVE_CHANNEL_TO_TOP,
    channelId: channelId,
    senderId: senderId,
    userId: userId,
  };
}

export function* getChannelDetails({accessToken, orgId, userId}) {
  try {
    var response = yield call(getChannelDetailsApi, accessToken, orgId, userId);
    yield put(getChannelDetailsSuccess(response));
  } catch (error) {
    console.warn(error);
  }
}
export function getChannelDetailsSuccess(data) {
  return {
    type: Actions.FETCH_CHANNEL_DETAILS_SUCCESS,
    payload: data,
  };
}

export function* resetUnreadCount({orgId, userId, teamId, accessToken,badgeCount,unreadCount}) {
  try {
    var response = yield call(
      resetUnreadCountApi,
      orgId,
      userId,
      teamId,
      accessToken,
      badgeCount,
      unreadCount
    );
    yield put(resetUnreadCountSuccess(response,teamId));
  } catch (error) {
    console.warn(error);
  }
}
export function resetUnreadCountStart(orgId, userId, teamId, accessToken,badgeCount,unreadCount) {
  return {
    type: Actions.RESET_UNREAD_COUNT_START,
    orgId,
    userId,
    teamId,
    accessToken,
    badgeCount,
    unreadCount
  };
}
export function resetUnreadCountSuccess(response , teamId) {
  return {
    type: Actions.RESET_UNREAD_COUNT_SUCCESS,
    teamId: teamId,
    response:response
  };
}

