import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrgCard = ({item}) => {
  return (
    <TouchableOpacity style={{borderWidth:.5,borderColor:'gray',borderRadius:5,marginVertical:'1%'}}>
      <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',padding:8}}>
        <View style={{flexDirection: 'row',alignItems:'center'}}>
          <Image
            source={{uri: item.icon}}
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
const OrgScreen = () => {
  console.log('inside org screen');
  const data = [
    {
      name: 'Programmer',
      icon: 'https://resources.intospace.io/cdn-cgi/image/width=96/gMv5N0EtECmu4Fa9_6b30b481-85e1-4ec6-9265-8464ea680f8f',
    },
    {
      name: 'Walkover',
      icon: 'https://resources.intospace.io/cdn-cgi/image/width=96/gMv5N0EtECmu4Fa9_6b30b481-85e1-4ec6-9265-8464ea680f8f',
    },
    {
      name: 'Channel',
      icon: 'https://resources.intospace.io/cdn-cgi/image/width=96/gMv5N0EtECmu4Fa9_6b30b481-85e1-4ec6-9265-8464ea680f8f',
    },
  ];
  return (
    <View style={{flex: 1}}>
      {/* <ScrollView style={{padding: 20}}> */}
        <View style={{paddingVertical: 5}}>
          <Text style={{textAlign: 'center', fontSize: 22, fontWeight: '400'}}>
            Welcome, UserName
          </Text>
        </View>
        <View style={{marginHorizontal: '5%'}}>
          <FlatList data={data} renderItem={OrgCard} />
        </View>
      {/* </ScrollView> */}
    </View>
  );
};
export default OrgScreen;
