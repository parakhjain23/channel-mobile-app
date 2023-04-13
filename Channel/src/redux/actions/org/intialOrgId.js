import * as Actions from '../../Enums'
export function setIntialOrgId(orgId,accessToken){
    return {
      type: Actions.SELECT_INITIAL_ORG_ID,
      accessToken:accessToken,
      orgId :orgId,
    }
  }
