export const getAllUsersOfOrgApi= async(token,orgId)=>{
    try {
        var response = await fetch(`https://api.intospace.io/orgs/${orgId}?getCouponDetails=true`,{
            method:'GET',
            headers: {
                'Authorization': token
            }
        })
        var result = await response.json();
        return result?.users
    } catch (error) {
        console.warn(error);
    }
}