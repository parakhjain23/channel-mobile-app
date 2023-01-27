import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { getChannelsStart } from '../../redux/actions/channels/ChannelsAction';

const OrgCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{borderWidth:.5,borderColor:'gray',borderRadius:5,marginVertical:'1%'}}>
      <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',padding:8}}>
        <View style={{flexDirection: 'row',alignItems:'center'}}>
          <Image
            source={item.iconKey ? {uri: `https://resources.intospace.io/cdn-cgi/image/width=100/${item.iconKey}`} : require('../../assests/images/appIcon/icon-48x48.png')}
            style={{height: 40, width: 40, marginRight: 10}}
          />
          <Text>{item.name}</Text>
        </View>
        <View>
          <Icon name="chevron-right" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
const OrgScreen = ({orgsState,userInfoState,getChannelsAction}) => {
  // console.log("hello");
  const data = orgsState?.orgs;
  useEffect(() => {
   if(userInfoState?.user != null){
    getChannelsAction(userInfoState?.accessToken,userInfoState?.orgId,userInfoState?.user?.id)
   }
  },[userInfoState?.user])
  
  return (
    <View style={{flex: 1}}>
      {/* <ScrollView style={{padding: 20}}> */}
        <View style={{paddingVertical: 5}}>
          <Text style={{textAlign: 'center', fontSize: 22, fontWeight: '400'}}>
            Welcome, UserName
          </Text>
        </View>
        <View style={{marginHorizontal: '5%'}}>
          {data?.map((item,index)=>{
            return <OrgCard key={index} item={item} />
          })}
          {/* <FlatList data={data} renderItem={OrgCard} /> */}
        </View>
      {/* </ScrollView> */}
    </View>
  );
};
const mapStateToProps = state => ({
  orgsState: state.orgsReducer,
  userInfoState : state.userInfoReducer
})
const mapDispatchToProps = dispatch =>{
  return{
    getChannelsAction: (token,orgId,userId)=> dispatch(getChannelsStart(token,orgId,userId))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(OrgScreen);
