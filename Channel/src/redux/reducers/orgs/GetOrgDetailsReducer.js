import * as Actions from '../../Enums';

const initialState = {
  isLoading: false,
  isInitiated: false,
  orgs: null,
  currentOrgId:null,
  orgIdAndNameMapping: null,
  userIdAndNameMapping: null
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
      action?.allUser?.map((item)=>{
        idAndNameMap[item?.id] = `${item?.firstName+" "+item?.lastName}`
      })
      return {...state, userIdAndNameMapping: idAndNameMap}  
    
    case Actions.NEW_USER_JOINED_ORG:
      var idAndNameMap = {};
      action?.user?.map((item)=>{
        idAndNameMap[item?.id] = `${item?.firstName+" "+item?.lastName}`
      })
      return {...state, userIdAndNameMapping: {...state?.userIdAndNameMapping,...idAndNameMap}}  
    default:
      return state;
  }
}
