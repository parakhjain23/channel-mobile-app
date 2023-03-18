import * as Actions from '../../Enums';

export function increaseCountOnOrgCard(orgId,teamId){
    return {
        type:Actions.INCREASE_COUNT_ON_ORG_CARD,
        orgId,teamId
    }
}

export function removeCountOnOrgCard(orgId){
    return {
        type:Actions.REMOVE_COUNT_ON_ORG_CARD,
        orgId
    }
}