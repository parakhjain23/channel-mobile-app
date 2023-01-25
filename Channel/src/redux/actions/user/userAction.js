import { SAVETOKEN } from "../../Enums";

export function saveUserToken(token){
    console.log("this IS TOKEN IN ACTION FUNCTION",token);
    return {
        type: SAVETOKEN,
        payload : token 
    }
}