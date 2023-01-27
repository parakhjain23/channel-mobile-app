import * as Actions from "../../Enums";

export function saveUserToken(token,orgId){
    console.log("this IS TOKEN IN ACTION FUNCTION",token,orgId);
    return {
        type: Actions.SAVETOKEN,
        accessToken : token,
        orgId : orgId 
    }
}