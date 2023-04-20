//FETCH USER ORGS
export const GET_ORG_START = 'GET_ORG_START';
export const GET_ORG_SUCCESS = 'GET_ORG_SUCCESS';
export const GET_ORG_ERROR = 'GET_ORG_ERROR';
export const GET_ORG_RESET = 'GET_ORG_RESET';
export const NO_ORGS_FOUND = 'NO_ORGS_FOUND'

export const SAVE_TOKEN = 'SAVE_TOKEN';
export const SIGN_OUT = 'SIGN_OUT';

//SET ACTIVE CHANNEL ID
export const SET_ACTIVE_CHANNEL_TEAMID = 'SET_ACTIVE_CHANNEL_TEAMID';
export const RESET_ACTIVE_CHANNEL_TEAMID = 'RESET_ACTIVE_CHANNEL_TEAMID';
//FETCH CHANNELS BY ORG ID
export const FETCH_CHANNELS_START = 'FETCH_CHANNELS_START';
export const FETCH_CHANNELS_SUCCESS = 'FETCH_CHANNELS_SUCCESS';
export const FETCH_CHANNELS_BY_QUERY_ERROR = 'FETCH_CHANNELS_BY_QUERY_ERROR';
export const FETCH_CHANNELS_BY_QUERY_START = 'FETCH_CHANNELS_BY_QUERY_START';
export const FETCH_CHANNELS_BY_QUERY_SUCCESS =
  'FETCH_CHANNELS_BY_QUERY_SUCCESS';
export const FETCH_CHANNELS_ERROR = 'FETCH_CHANNELS_ERROR';
export const FETCH_CHANNEL_DETAILS_SUCCESS = 'FETCH_CHANNEL_DETAILS_SUCCESS';
export const FETCH_RECENT_CHANNELS_SUCCESS = 'FETCH_RECENT_CHANNELS_SUCCESS';
export const MOVE_CHANNEL_TO_TOP = 'MOVE_CHANNEL_TO_TOP';

export const RESET_UNREAD_COUNT_START = 'RESET_UNREAD_COUNT_START'
export const RESET_UNREAD_COUNT_SUCCESS = 'RESET_UNREAD_COUNT_SUCCESS'
//CREATE CHANNELS
export const CREATE_NEW_CHANNEL_START = 'CREATE_NEW_CHANNEL_START';
export const CREATE_NEW_CHANNEL_SUCCESS = 'CREATE_NEW_CHANNEL_SUCCESS';
export const CREATE_NEW_DM_CHANNEL_START = 'CREATE_NEW_DM_CHANNEL_START';

//NEW USER JOINED A ORG
export const NEW_USER_JOINED_ORG = 'NEW_USER_JOINED_ORG';

//CHAT
export const FETCH_CHAT_START = 'FETCH_CHAT_START';
export const FETCH_CHAT_SUCCESS = 'FETCH_CHAT_SUCCESS';
export const FETCH_CHAT_ERROR = 'FETCH_CHAT_ERROR';
export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
export const FETCH_CHAT_RESET = 'FETCH_CHAT_RESET';
export const SET_GLOBAL_MESSAGE_TO_SEND = 'SET_GLOBAL_MESSAGE_TO_SEND';

//DELETE MESSAGE
export const DELETE_MESSAGE_START = 'DELETE_MESSAGE_START';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';

export const SEND_MESSAGE_START = 'SEND_MESSAGE_START';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';

// FETCH USER DETAILS BY ACCESS TOKEN
export const FETCH_USER_DETAILS_SUCCESS = 'FETCH_USER_DETAILS_SUCCESS';

// UPDATE CURRENT ORG ID AFTER ORG SWITCH
export const UPDATE_CURRENT_ORG_ID = 'UPDATE_CURRENT_ORG_ID';

// GET ALL USERS OF A PARTICULAR ORG
export const GET_ALL_USERS_SUCCESS = 'GET_ALL_USERS_SUCCESS';
export const GET_ALL_USERS_START = 'GET_ALL_USERS_START';

//SUBSCRIBE TO NOTIFICATIONS

export const SUBSCRIBE_TO_NOTIFICATIONS = 'SUBSCRIBE_TO_NOTIFICATIONS';
//RECENT_CHANNELS

export const NETWORK_STATUS = 'NETWORK_STATUS';
//SEARCH USER PROFILE DETAILS   
export const SEARCH_USER_PROFILE_START = 'SEARCH_USER_PROFILE_START'
export const SEARCH_USER_PROFILE_SUCCESS = 'SEARCH_USER_PROFILE_SUCCESS'

//UNREAD COUNT ON ORG CARDS AND DRAWER ICON 
export const INCREASE_COUNT_ON_ORG_CARD = 'INCREASE_COUNT_ON_ORG_CARD'
export const REMOVE_COUNT_ON_ORG_CARD = 'REMOVE_COUNT_ON_ORG_CARD'

export const UPDATE_APP_VERSION = 'UPDATE_APP_VERSION';
//GET CHANNEL BY TEAMID 
export const GET_CHANNEL_START ='GET_CHANNEL_START'
export const GET_CHANNEL_SUCCESS ='GET_CHANNEL_SUCCESS'

//ADD LOCAL MESSAGE IN GLOBAL STATE
export const ADD_LOCAL_MESSAGE = 'ADD_LOCAL_MESSAGE'

//Space Token 
export const GET_SPACE_TOKEN_START = 'GET_SPACE_TOKEN_START'
export const GET_SPACE_TOKEN_SUCCESS = 'GET_SPACE_TOKEN_SUCCESS'
// select intial org id 
export const SELECT_INITIAL_ORG_ID ='SELECT_INITIAL_ORG_ID'