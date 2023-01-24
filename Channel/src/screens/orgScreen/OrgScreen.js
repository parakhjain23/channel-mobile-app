import React from 'react'
import { Text, View } from 'react-native'

const OrgScreen = ({naviagation}) =>{
    const data = [
        {
            name: "Programmer",
            icon: 'https://resources.intospace.io/cdn-cgi/image/width=96/gMv5N0EtECmu4Fa9_6b30b481-85e1-4ec6-9265-8464ea680f8f',
        },
        {
            name: "Walkover",
            icon: 'https://resources.intospace.io/cdn-cgi/image/width=96/gMv5N0EtECmu4Fa9_6b30b481-85e1-4ec6-9265-8464ea680f8f',
        },
    ]
    return(
        <View style={{backgroundColor:'grey',flex:1,justifyContent:'center'}}>
            <Text style={{color:'yellow'}}>
                this IS ORG SCREEN
            </Text>
        </View>
    )
}

export default OrgScreen