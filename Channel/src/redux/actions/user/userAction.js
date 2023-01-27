import { SAVETOKEN } from "../../Enums";

export function saveUserToken(token,orgId){
    console.log("this IS TOKEN IN ACTION FUNCTION",token);
    return {
        type: SAVETOKEN,
        accessToken : token,
        orgId : orgId 
    }
}