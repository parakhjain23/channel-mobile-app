import * as Actions from '../../Enums'
export function networkStatus(data){
    return {
      type: Actions.NETWORK_STATUS,
      data : data,
    }
  }
