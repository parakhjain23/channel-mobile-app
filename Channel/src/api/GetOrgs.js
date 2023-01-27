export const fetchOrgsApi= async(token)=>{
    console.log('in fetch orgs api with token',token);
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
        console.log(error);
    }
}