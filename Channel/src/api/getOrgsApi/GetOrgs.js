export const fetchOrgsApi= async(token)=>{
    try {
        var response = await fetch('https://api.intospace.io/users?followedOrgs=true',{
            method:'GET',
            headers: {
                'Authorization': token
            }
        })
        var result = await response.json();
        return result?.orgs;
    } catch (error) {
        return []
    }
}