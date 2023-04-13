export const getSpaceAccessTokenApi= async(firebaseToken)=>{
    try {
        var response = await fetch(`https://api.intospace.io/authentication`,{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                firebaseAccessToken : firebaseToken
            })
        })
        var result = await response.json();
        return result;
    } catch (error) {
        console.warn(error);
    }
}