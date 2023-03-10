export const getUserDetailsApi= async(token)=>{
    try {
        var response = await fetch('https://api.intospace.io/users?getCurrentUser=true',{
            method:'GET',
            headers: {
                'Authorization': token
            }
        })
        var result = await response.json();
        return result;
    } catch (error) {
        console.warn(error);
    }
}
export const searchUserProfileApi= async(userId,token)=>{
    try {
        var response = await fetch(`https://api.intospace.io/users/${userId}`,{
            method:'GET',
            headers: {
                'Authorization': token
            }
        })
        var result = await response.json();
        return result;
    } catch (error) {
        console.warn(error);
    }
}