import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Button,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {getChannelsStart} from '../../redux/actions/channels/ChannelsAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBox from '../../components/searchBox';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {FAB, RadioButton, TextInput} from 'react-native-paper';
import {Modalize} from 'react-native-modalize';
import {CHANNEL_TYPE} from '../../constants/Constants';
import {createNewChannelStart} from '../../redux/actions/channels/CreateNewChannelAction';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';
import {createNewDmChannelStart} from '../../redux/actions/channels/CreateNewDmChannelAction';
import {
  resetActiveChannelTeamId,
  setActiveChannelTeamId,
} from '../../redux/actions/channels/SetActiveChannelId';
import NoChannelsFound from './NoChannelsFound';

const RenderChannels = ({item, navigation, props}) => {
  const Name =
    item?.type == 'DIRECT_MESSAGE'
      ? props?.orgsState?.userIdAndNameMapping &&
        props?.orgsState?.userIdAndNameMapping[
          `${
            item.userIds[0] != props?.userInfoState?.user?.id
              ? item.userIds[0]
              : item.userIds[1]
          }`
        ]
      : item?.name;
   const iconName = item?.type == 'DIRECT_MESSAGE' ? "user" : "hashtag"   
   var nameFontWeight
   props?.channelsState?.highlightChannel[item?._id]!= undefined  ? nameFontWeight = props?.channelsState?.highlightChannel[item?._id] ? '600' :'400' :'400'
  return (
    <TouchableOpacity
      style={{
        // borderBottomWidth: 0.5,
        borderWidth:0.5,
        borderColor: 'gray',
        // borderRadius: 5,
        minHeight: 60,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onPress={() => {
        props?.setActiveChannelTeamIdAction(item?._id);
        navigation.navigate('Chat', {chatHeaderTitle: Name, teamId: item?._id});
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 13,
        }}>
        <Icon name={iconName} size={14} />
        <Text style={{fontSize: 16, fontWeight:nameFontWeight, color: 'black'}}>
          {' '}
          {Name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const RenderSearchChannels = ({item, navigation, props, setsearchValue}) => {
  const Name =
    item?._source?.type == 'U'
      ? item?._source?.title
      : '#' + item?._source?.title;
  const teamId = item?._id?.includes('_')
    ? props?.channelsState?.userIdAndTeamIdMapping[item?._source?.userId]
    : item?._id;
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
      onPress={() => {
        if (teamId == undefined) {
          props?.createDmChannelAction(
            props?.userInfoState?.accessToken,
            props?.orgsState?.currentOrgId,
            Name,
            item?._source?.userId,
          );
        }
        setsearchValue('');
        navigation.navigate('Chat', {
          chatHeaderTitle: Name,
          teamId: teamId,
          reciverUserId: item?._source?.userId,
        });
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
          {Name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const RenderUsersToAdd = ({item, setUserIds, userIds, setsearchedUser}) => {
  const Name = item?._source?.type == 'U' && item?._source?.title;
  return (
    item?._source?.type == 'U' && (
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
        onPress={() => {
          setUserIds([...userIds, item?._source?.userId]);
          setsearchedUser('');
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
            {Name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  );
};
const CreateChannelModel = ({modalizeRef, props}) => {
  const [title, setTitle] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  const [userIds, setUserIds] = useState([]);
  const [searchedUser, setsearchedUser] = useState('');
  useEffect(() => {
    if (searchedUser != '') {
      props.getChannelsByQueryStartAction(
        searchedUser,
        props?.userInfoState?.user?.id,
        props?.orgsState?.currentOrgId,
      );
    }
  }, [searchedUser]);

  const changeText = value => {
    setsearchedUser(value);
  };
  return (
    <Modalize
      scrollViewProps={{keyboardShouldPersistTaps: 'always'}}
      ref={modalizeRef}
      modalStyle={{top: '12%'}}>
      <View style={{margin: 12}}>
        <TextInput
          label={'Title'}
          mode={'outlined'}
          onChangeText={setTitle}
          autoFocus={true}
        />
        <TextInput
          label={'Members'}
          mode={'outlined'}
          onChangeText={changeText}
        />

        {searchedUser != '' && (
          <View style={{height: 200}}>
            <FlatList
              data={props?.channelsByQueryState?.channels}
              renderItem={({item}) => (
                <RenderUsersToAdd
                  item={item}
                  setUserIds={setUserIds}
                  userIds={userIds}
                  setsearchedUser={setsearchedUser}
                />
              )}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
            />
          </View>
        )}
        {userIds.length != 0 &&
          userIds?.map(userId => {
            return (
              <View
                style={{
                  marginVertical: 6,
                  height: 30,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
                    {props?.orgsState?.userIdAndNameMapping[userId]}
                  </Text>
                </View>
                <Button
                  title="remove"
                  onPress={() => {
                    var updatedUserIds = userIds.filter(id => id !== userId);
                    setUserIds(updatedUserIds);
                  }}
                />
              </View>
            );
          })}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            marginVertical: 20,
          }}>
          {CHANNEL_TYPE?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => setChannelType(item?.type)}>
                <Text>{item?.name}</Text>
                <RadioButton
                  value={item?.type}
                  status={channelType === item?.type ? 'checked' : 'unchecked'}
                  onPress={() => setChannelType(item?.type)}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Button
          title="Create Channel"
          onPress={() => {
            if (title === '') {
              Alert.alert('Please Enter the title');
            } else {
              props.createNewChannelAction(
                props?.userInfoState?.accessToken,
                props?.orgsState?.currentOrgId,
                title,
                channelType,
                userIds,
              );
              modalizeRef?.current?.close();
              setUserIds([]);
            }
          }}
        />
      </View>
    </Modalize>
  );
};

const ChannelsScreen = props => {
  const [searchValue, setsearchValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const modalizeRef = useRef(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("inside is focusedddd");
      props?.resetActiveChannelTeamIdAction();
    }
  }, [isFocused]);
  console.log(props?.channelsState?.activeChannelTeamId);
  useEffect(() => {
    if (searchValue != '') {
      props.getChannelsByQueryStartAction(
        searchValue,
        props?.userInfoState?.user?.id,
        props?.orgsState?.currentOrgId,
      );
    }
  }, [searchValue]);
  const changeText = value => {
    setsearchValue(value);
  };
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      props.getChannelsAction(
        props?.userInfoState?.accessToken,
        props?.orgsState?.currentOrgId,
        props?.userInfoState?.user?.id,
      );
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={{flex: 1}}>
      {props?.channelsState?.isLoading ? (
        <ActivityIndicator size={'large'} color={'black'} />
      ) : (
        <View style={{flex:1}}>
          {searchValue != '' ? (
            props?.channelsByQueryState?.channels?.length > 0 ? (
              <FlatList
                data={props?.channelsByQueryState?.channels}
                renderItem={({item}) => (
                  <RenderSearchChannels
                    item={item}
                    navigation={navigation}
                    props={props}
                    setsearchValue={setsearchValue}
                  />
                )}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
              />
            ) : (
              <NoChannelsFound modalizeRef={modalizeRef} setsearchValue={setsearchValue}/>
            )
          ) : (
            <FlatList
              data={props?.channelsState?.channels}
              renderItem={({item}) => (
                <RenderChannels
                  item={item}
                  navigation={navigation}
                  props={props}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
            />
          )}
          <View style={{position:'absolute',bottom:0,width:'100%'}}>
            <SearchBox
              searchValue={searchValue}
              changeText={changeText}
              isSearchFocus={false}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 80,
              right: 10,
              alignItems: 'flex-end',
            }}>
            <FAB
              onPress={onOpen}
              color={'black'}
              animated={true}
              uppercase={false}
              style={{
                backgroundColor: '#4db8ff',
              }}
              label={`New\nChannel`}
            />
          </View>
        </View>
      )}
      <CreateChannelModel modalizeRef={modalizeRef} props={props} />
    </View>
  );
};
const mapStateToProps = state => ({
  orgsState: state.orgsReducer,
  channelsState: state.channelsReducer,
  channelsByQueryState: state.channelsByQueryReducer,
  userInfoState: state.userInfoReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    getChannelsAction: (token, orgId, userId) =>
      dispatch(getChannelsStart(token, orgId, userId)),
    getChannelsByQueryStartAction: (query, userToken, orgId) =>
      dispatch(getChannelsByQueryStart(query, userToken, orgId)),
    createNewChannelAction: (token, orgId, title, channelType, userIds) =>
      dispatch(
        createNewChannelStart(token, orgId, title, channelType, userIds),
      ),
    createDmChannelAction: (token, orgId, title, reciverUserId) =>
      dispatch(createNewDmChannelStart(token, orgId, title, reciverUserId)),
    setActiveChannelTeamIdAction: teamId =>
      dispatch(setActiveChannelTeamId(teamId)),
    resetActiveChannelTeamIdAction: () => dispatch(resetActiveChannelTeamId()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChannelsScreen);
//9826018514 RTO IMP NO DONT DELETE
