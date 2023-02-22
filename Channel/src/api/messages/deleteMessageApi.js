export const deleteMessageApi= async(token,msgId)=>{
    try {
        var response = await fetch(`https://api.intospace.io/chat/message/${msgId}`,{
            method:'PATCH',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deleted : true
            }),
        })
        var result = await response.json();
        return result
    }catch (error) {
        console.warn(error);
    }
}