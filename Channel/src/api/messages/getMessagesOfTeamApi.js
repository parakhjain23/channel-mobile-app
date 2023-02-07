export const getMessagesOfTeamApi= async(teamId,token,skip)=>{
    try {
        var response = await fetch(`https://api.intospace.io/chat//message?teamId=${teamId}&deleted=false&$limit=30&$paginate=false&parentMessages=true&$skip=${skip}`,{
            method:'GET',
            headers: {
                'Authorization': token
            }
        })
        var result = await response.json();
        // console.log(result);
        return result
    } catch (error) {
        console.log(error);
    }
}