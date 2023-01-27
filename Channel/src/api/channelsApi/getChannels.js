export const getChannelsApi= async(token,orgId,userId)=>{
    console.log(orgId,userId,"=-=-=-=-asdfgasdfghjklasdfghj");
    try {
        var response = await fetch(`https://api.intospace.io/chat/team?orgId=${orgId}&$paginate=false&includeUsers=false&userIds=${userId}`,
            {
                method:'GET',
                headers: {
                    'Authorization': token
                }
            }
        )
        const result = await response.json()
        console.log(result,"THIS ARE CHANNELS =-=-=-=-00-0--9090897876");
        return result
    } catch (error) {
        console.log(error);
    }
}