import * as Actions from '../../Enums'
export function networkStatus(status){
    return {
        type: Actions.NETWORK_STATUS,
        status: status
    }
}