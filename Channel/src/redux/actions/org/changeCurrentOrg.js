import * as Actions from '../../Enums'
export function switchOrgStart(accessToken,orgId,userId){
    return {
      type: Actions.UPDATE_CURRENT_ORG_ID,
      accessToken:accessToken,
      orgId :orgId,
      userId:userId
    }
  }
