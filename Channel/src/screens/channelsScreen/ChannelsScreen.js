import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {getChannelsStart} from '../../redux/actions/channels/ChannelsAction';
import {saveUserToken} from '../../redux/actions/user/userAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBox from '../../components/searchBox';
import {FAB} from '@rneui/themed';

const ChannelsScreen = props => {
  const [searchValue, setsearchValue] = useState('')

  const renderChannels = ({item}) => {
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
        }}>
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
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const changeText = value => {
    setsearchValue(value);
  };

  useEffect(() => {
    if (props?.channelsState?.channels == []) {
      props?.getChannelsStartAction(
        props?.channelsState?.accessToken,
        props?.channelsState?.orgId,
        props?.userInfoState?.user?.id
      );
    }
  });

  return (
    <View style={{flex: 1, padding: 5}}>
      {props?.channelsState?.isLoading ? <ActivityIndicator size={'large'} color={'black'}/> :
         <>
          <FlatList data={props?.channelsState?.channels} renderItem={renderChannels} 
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
