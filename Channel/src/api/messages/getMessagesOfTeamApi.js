export const getMessagesOfTeamApi= async(teamId,token)=>{
    try {
        var response = await fetch(`https://api.intospace.io/chat//message?teamId=${teamId}&deleted=false&$limit=30&$paginate=false&parentMessages=true&$skip=0`,{
            method:'GET',
            headers: {
                'Authorization': token
            }
        })
        var result = await response.json();
        return result
    } catch (error) {
        console.log(error);
    }
}