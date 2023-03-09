import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';
import {getChannelsStart} from '../../redux/actions/channels/ChannelsAction';
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
import {
  RenderChannels,
  RenderSearchChannels,
  RenderUsersToAdd,
} from './ChannelCard';
import Icon, {MaterialIcons} from 'react-native-vector-icons/MaterialIcons';

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
      onClose={() => setsearchedUser('')}
      // avoidKeyboardLikeIOS={true}
      modalStyle={{flex: 1, marginTop: '5%'}}>
      <View style={{margin: 12, flex: 1}}>
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
          <ScrollView
            style={{maxHeight: 200}}
            keyboardShouldPersistTaps="always">
            {props?.channelsByQueryState?.channels?.map((item, index) => {
              return (
                item?._source?.type == 'U' && (
                  <RenderUsersToAdd
                    key={index}
                    item={item}
                    setUserIds={setUserIds}
                    userIds={userIds}
                    setsearchedUser={setsearchedUser}
                  />
                )
              );
            })}
          </ScrollView>
        )}
        {userIds.length != 0 &&
          userIds?.map((userId, index) => {
            return (
              <View
                key={index}
                style={{
                  marginVertical: 5,
                  // height: 30,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
                    {props?.orgsState?.userIdAndNameMapping[userId]}
                  </Text>
                </View>
                <Button
                  title="Remove"
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
                <Text style={{color:'black'}}>{item?.name}</Text>
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
          disabled={title.trim() == '' ? true : false}
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
              setUserIds([]);
              modalizeRef?.current?.close();
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
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollY = new Animated.Value(0);

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolling(offsetY > 0);
      },
    },
  );
  useEffect(() => {
    if (isFocused) {
      props?.resetActiveChannelTeamIdAction();
    }
  }, [isFocused]);
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
  // const onRefresh = React.useCallback(async () => {
  //   setRefreshing(true);
  //   await props.getChannelsAction(
  //     props?.userInfoState?.accessToken,
  //     props?.orgsState?.currentOrgId,
  //     props?.userInfoState?.user?.id,
  //   );
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 2000);
  // }, []);
  const renderItemChannels = useCallback(
    ({item, index}) => {
      return (
        <RenderChannels item={item} navigation={navigation} props={props} />
      );
    },
    [
      props?.channelsState?.channels,
      props?.channelsState,
      props?.orgsState?.userIdAndNameMapping,
    ],
  );
  const renderItemSearchChannels = useCallback(
    ({item}) => {
      return (
        <RenderSearchChannels
          item={item}
          navigation={navigation}
          props={props}
          setsearchValue={setsearchValue}
        />
      );
    },
    [props?.channelsByQueryState?.channels],
  );
  return (
    <View style={{flex: 1,backgroundColor:'white'}}>
      {props?.channelsState?.isLoading ? (
        <ActivityIndicator size={'large'} color={'black'} />
      ) : (
        <View style={{flex: 1}}>
          {searchValue != '' ? (
            props?.channelsByQueryState?.channels?.length > 0 ? (
              <FlatList
                data={props?.channelsByQueryState?.channels}
                renderItem={renderItemSearchChannels}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
              />
            ) : (
              <NoChannelsFound
                modalizeRef={modalizeRef}
                setsearchValue={setsearchValue}
              />
            )
          ) : (
            <Animated.FlatList
              data={
                props?.channelsState?.recentChannels ||
                props?.channelsState?.channels
              }
              renderItem={renderItemChannels}
              onScroll={onScroll}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
            />
          )}
          {isScrolling && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                zIndex: 1,
                opacity: isScrolling ? 1 : 0,
              }}>
              <SearchBox
                searchValue={searchValue}
                changeText={changeText}
                isSearchFocus={false}
              />
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 70,
              right: 10,
              alignSelf: 'center',
            }}>
            <FAB
              onPress={onOpen}
              color={'white'}
              animated={false}
              uppercase={false}
              icon={() => <Icon name="add" size={20} color={'white'} />}
              style={{
                backgroundColor: '#333333', // change the background color to light grey
                borderRadius: 50,
                alignSelf: 'center',
              }}
              labelStyle={{
                fontSize: 12,
                textAlign: 'center',
                lineHeight: 14,
              }}
              // label={`New\nChannel`}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setIsScrolling(true);
            }}>
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: '#333333',
                borderRadius: 25,
                padding: 15,
              }}>
              <Icon name="search" size={22} color={'white'} />
            </View>
          </TouchableOpacity>
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
