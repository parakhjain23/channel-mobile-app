import * as Actions from '../../Enums';

const initialState = {
  isLoading: false,
  isInitiated: false,
  orgs: null,
  currentOrgId:null,
  orgIdAndNameMapping: null,
  userIdAndNameMapping: null,
  userIdAndDisplayNameMapping:null,
  orgsWithNewMessages:{},
  unreadCountForDrawerIcon:0
};

export function orgsReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SAVE_TOKEN_AND_ORGID : 
      return {...state, currentOrgId : action.orgId }

    case Actions.UPDATE_CURRENT_ORG_ID :
      return {...state, currentOrgId : action.orgId}
      
    case Actions.GET_ORG_START:
      return {...state, isLoading: true, isInitiated: true};

    case Actions.GET_ORG_SUCCESS:
      var orgIdAndNameObj = {};
      action?.payload?.map((org)=>{
        orgIdAndNameObj[org?.id]=org?.name
      })
      return {...state, orgs: action.payload, isLoading: false, orgIdAndNameMapping:orgIdAndNameObj};

    case Actions.GET_ALL_USERS_SUCCESS:
      var idAndNameMap = {};
      var idAndDisplayNameMap={};
      action?.allUser?.map((item)=>{
        idAndNameMap[item?.id] = `${item?.firstName+" "+item?.lastName}`
        idAndDisplayNameMap[item?.id] = `${item?.displayName}`
      })
      idAndDisplayNameMap['all']='channel'
      return {...state, userIdAndNameMapping: idAndNameMap,userIdAndDisplayNameMapping:idAndDisplayNameMap}  
    
    case Actions.NEW_USER_JOINED_ORG:
      var idAndNameMap = {};
      action?.user?.map((item)=>{
        idAndNameMap[item?.id] = `${item?.firstName+" "+item?.lastName}`
        idAndDisplayNameMap[item?.id] = `${item?.displayName}`
      })
      return {...state, userIdAndNameMapping: {...state?.userIdAndNameMapping,...idAndNameMap},userIdAndDisplayNameMapping:{...state?.userIdAndDisplayNameMapping,...idAndDisplayNameMap}}  
    case Actions.INCREASE_COUNT_ON_ORG_CARD:
      var orgId = action?.orgId
      var teamId = action?.teamId
      const newMessageObj = {
        ...state.orgsWithNewMessages,
        [orgId]: {
          ...(state.orgsWithNewMessages[orgId] || {}),
          [teamId]: (state.orgsWithNewMessages[orgId]?.[teamId] || 0) + 1
        }
      }
      var countOnDrawerIcon = Object.keys(newMessageObj).length
      return {
        ...state,
        orgsWithNewMessages: newMessageObj,
        unreadCountForDrawerIcon:countOnDrawerIcon
      }
    default:
      return state;
  }
}
