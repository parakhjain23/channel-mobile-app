import React, {useEffect, useState} from 'react';
import {
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
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import OrgScreen from '../orgScreen/OrgScreen';
import { useNavigation } from '@react-navigation/native';

const ChannelsScreen = props => {
  // console.log('in channel sc',props);
  console.log('inside channel');
  const sampleData = [
    {
      _id: '60b1cc779067603098f21a8b',
      type: 'PUBLIC',
      isArchived: false,
      name: 'Channel Bugs and Suggestions Space',
      purpose:
        'if you find any bugs or suggestion you can post into this channel ',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'LvtcQ1RjuA57yGZB',
      updatedBy: 'LvtcQ1RjuA57yGZB',
      createdAt: '2021-05-29T05:09:11.888Z',
      updatedAt: '2023-01-11T10:31:44.613Z',
      __v: 0,
      webrtcSessionInfo: {
        hostId: 'xmR8KSBRTynbRfFl',
        createdAt: '2021-08-03T18:08:36.504Z',
      },
      userIds: ['7klSRq3JwEei3ja8', 'p9SKWVWw9Ibm90jL'],
    },
    {
      _id: '60bdc426255d8b449631c868',
      type: 'PUBLIC',
      isArchived: true,
      name: 'Task-Updates',
      purpose: '',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'plfvQttQqdXxKZly',
      updatedBy: 'plfvQttQqdXxKZly',
      createdAt: '2021-06-07T07:00:54.784Z',
      updatedAt: '2022-07-15T12:54:51.809Z',
      __v: 0,
      userIds: ['NLvrq5faem319jZf', 'cwB5sG4IhhlNxU9Q'],
    },
    {
      _id: '612c58695f32b50011622411',
      type: 'PUBLIC',
      isArchived: true,
      name: 'viasocket focus',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: '7klSRq3JwEei3ja8',
      updatedBy: '7klSRq3JwEei3ja8',
      createdAt: '2021-08-30T04:02:49.420Z',
      updatedAt: '2022-09-15T08:00:05.985Z',
      __v: 0,
      userIds: ['7klSRq3JwEei3ja8', 'oK89Wipm0AvLLOyF', 'KnFw7eHkG87dZ8BO'],
    },
    {
      _id: '612c7101a7df920010a9d4d1',
      type: 'PUBLIC',
      isArchived: true,
      name: 'viasocket-ideas',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'vPZ5W3S8coG7Mjqh',
      updatedBy: 'vPZ5W3S8coG7Mjqh',
      createdAt: '2021-08-30T05:47:45.517Z',
      updatedAt: '2022-09-21T03:50:03.890Z',
      __v: 0,
      userIds: [
        '7klSRq3JwEei3ja8',
        'kfGVmS9pHQeLZOdR',
        'mNJvieI6vRuiuOSP',
        'KnFw7eHkG87dZ8BO',
      ],
    },
    {
      _id: '612c921da24e8200106af5ce',
      type: 'PUBLIC',
      isArchived: true,
      name: 'testing',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: '7klSRq3JwEei3ja8',
      updatedBy: '7klSRq3JwEei3ja8',
      createdAt: '2021-08-30T08:09:01.823Z',
      updatedAt: '2022-02-04T00:00:15.479Z',
      __v: 0,
      userIds: ['7klSRq3JwEei3ja8', 'NLvrq5faem319jZf'],
    },
    {
      _id: '612ccabdaa158c001137c6f9',
      type: 'PUBLIC',
      isArchived: true,
      name: 'test',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'NLvrq5faem319jZf',
      updatedBy: 'NLvrq5faem319jZf',
      createdAt: '2021-08-30T12:10:37.535Z',
      updatedAt: '2022-04-08T05:25:49.837Z',
      __v: 0,
      userIds: ['NLvrq5faem319jZf', '7klSRq3JwEei3ja8'],
    },
    {
      _id: '612d18ad10aa210011e56b25',
      type: 'PUBLIC',
      isArchived: true,
      name: 'asdfl jlsdkf',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: '7klSRq3JwEei3ja8',
      updatedBy: '7klSRq3JwEei3ja8',
      createdAt: '2021-08-30T17:43:09.272Z',
      updatedAt: '2022-01-31T13:24:55.106Z',
      __v: 0,
      userIds: ['7klSRq3JwEei3ja8'],
    },
    {
      _id: '61051985fc0c100011c4d64a',
      type: 'PUBLIC',
      isArchived: true,
      name: 'notification-changes',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'plfvQttQqdXxKZly',
      updatedBy: 'plfvQttQqdXxKZly',
      createdAt: '2021-07-31T09:36:05.129Z',
      updatedAt: '2022-07-01T04:42:08.468Z',
      __v: 0,
      userIds: ['7klSRq3JwEei3ja8', 'NLvrq5faem319jZf', 'cwB5sG4IhhlNxU9Q'],
    },
    {
      _id: '610a24e0df94b10010c67fa2',
      type: 'PUBLIC',
      isArchived: true,
      name: 'online-offline-android-bug',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'plfvQttQqdXxKZly',
      updatedBy: 'plfvQttQqdXxKZly',
      createdAt: '2021-08-04T05:25:52.202Z',
      updatedAt: '2022-07-01T04:42:08.468Z',
      __v: 0,
      userIds: [],
    },
    {
      _id: '610bd633ab5a4d00115cfe74',
      type: 'PUBLIC',
      isArchived: true,
      name: 'ws connection (recognize app)',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'plfvQttQqdXxKZly',
      updatedBy: 'plfvQttQqdXxKZly',
      createdAt: '2021-08-05T12:14:43.860Z',
      updatedAt: '2022-07-15T12:50:22.392Z',
      __v: 0,
      userIds: [],
    },
    {
      _id: '610cf964676761001111da5f',
      type: 'PUBLIC',
      isArchived: true,
      name: 'message-api optimization',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'plfvQttQqdXxKZly',
      updatedBy: 'plfvQttQqdXxKZly',
      createdAt: '2021-08-06T08:57:08.036Z',
      updatedAt: '2022-07-15T12:50:22.392Z',
      __v: 0,
      userIds: [],
    },
    {
      _id: '61122f4061af76001049c2be',
      type: 'PUBLIC',
      isArchived: true,
      name: 'product demo',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: 'WiwgZRawKZmS0EQl',
      updatedBy: 'WiwgZRawKZmS0EQl',
      createdAt: '2021-08-10T07:48:16.225Z',
      updatedAt: '2022-01-31T13:24:55.565Z',
      __v: 0,
      userIds: [],
    },
    {
      _id: '6113eb10bb890f0010891b83',
      type: 'PUBLIC',
      isArchived: true,
      name: 'Marketing space',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: '7klSRq3JwEei3ja8',
      updatedBy: '7klSRq3JwEei3ja8',
      createdAt: '2021-08-11T15:21:52.271Z',
      updatedAt: '2022-01-31T19:52:35.695Z',
      __v: 0,
      webrtcSessionInfo: {
        hostId: '7klSRq3JwEei3ja8',
        createdAt: '2021-08-11T15:23:30.154Z',
      },
      userIds: [
        '7klSRq3JwEei3ja8',
        'NLvrq5faem319jZf',
        'P8RG1sMiHuZkU59x',
        'UUy3SuRrua09RxTv',
        'cwB5sG4IhhlNxU9Q',
        'dsmT5n4AdnWiyD4K',
        'oK89Wipm0AvLLOyF',
      ],
    },
    {
      _id: '611b543c936d260010596e6a',
      type: 'PUBLIC',
      isArchived: true,
      name: 'chat',
      orgId: 'q957w6rtkdinckgbp8vv',
      createdBy: '7klSRq3JwEei3ja8',
      updatedBy: '7klSRq3JwEei3ja8',
      createdAt: '2021-08-17T06:16:28.780Z',
      updatedAt: '2022-01-31T13:24:55.740Z',
      __v: 0,
      userIds: ['7klSRq3JwEei3ja8'],
    },
  ];

  const RenderChannels = ({item,navigation}) => {
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
        onPress={()=>navigation.navigate("")}
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
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    if (props?.channelsState?.channels == []) {
      props.fetchChannelsAction(
        props.channelsState.accessToken,
        props.channelsState.orgId,
      );
    }
  });

  const navigation = useNavigation();
  return (
      <View style={{flex: 1, padding: 5}}>
      <FlatList data={sampleData}
      renderItem={({ item }) => <RenderChannels item={item} navigation={navigation} />}
      />
    </View>
  );
};
const mapStateToProps = state => ({
  channelsState: state.channelsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    fetchChannelsAction: (token, orgId) =>
      dispatch(getChannelsStart(token, orgId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChannelsScreen);
