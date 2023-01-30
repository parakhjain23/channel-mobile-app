import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {getChannelsStart} from '../../redux/actions/channels/ChannelsAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBox from '../../components/searchBox';
import { useNavigation } from '@react-navigation/native';

const RenderChannels = ({item,navigation,props}) => {
  const Name = item?.type == 'DIRECT_MESSAGE' ? props?.orgsState?.userIdAndNameMapping[`${item.userIds[0] != props?.userInfoState?.user?.id ? item.userIds[0] : item.userIds[1] }`]:item?.name
  return (
    <TouchableOpacity
      style={{
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 5,
        height: 60,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onPress={()=>navigation.navigate("Chat",{chatHeaderTitle:Name})}
      >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 13,
        }}>
        <Icon name="chevron-right" />
        <Text style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
          {' '}
          {Name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const ChannelsScreen = props => {
  const [searchValue, setsearchValue] = useState('')
  const changeText = value => {
    setsearchValue(value);
  };

  const navigation = useNavigation();
  return (
    <View style={{flex: 1, padding: 5}}>
      {props?.channelsState?.isLoading ? <ActivityIndicator size={'large'} color={'black'}/> :
         <>
          <FlatList data={props?.channelsState?.channels} renderItem={({ item }) => <RenderChannels item={item} navigation={navigation} props={props}/>}
          />
          <SearchBox 
             searchValue={searchValue}
             changeText={changeText}
             isSearchFocus={false}
          />
          </>
      }
    </View>
  );
};
const mapStateToProps = state => ({
  orgsState : state.orgsReducer,
  channelsState: state.channelsReducer,
  userInfoState: state.userInfoReducer
});
const mapDispatchToProps = dispatch => {
  return {
    getChannelsStartAction: (token, orgId,userId) =>
      dispatch(getChannelsStart(token, orgId,userId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChannelsScreen);
