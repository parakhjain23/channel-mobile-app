import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {getChannelsStart} from '../../redux/actions/channels/ChannelsAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBox from '../../components/searchBox';
import {useNavigation} from '@react-navigation/native';
import {FAB, RadioButton, TextInput} from 'react-native-paper';
import {Modalize} from 'react-native-modalize';
import {CHANNEL_TYPE} from '../../constants/Constants';
import {createNewChannelStart} from '../../redux/actions/channels/CreateNewChannelAction';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';

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
      onPress={() =>
        navigation.navigate('Chat', {chatHeaderTitle: Name, teamId: item?._id})
      }>
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
const RenderSearchChannels = ({item, navigation, props}) => {
  const Name =
    item?._source?.type == 'U'
      ? item?._source?.displayName
      : '#'+item?._source?.title;
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
      onPress={() =>
        navigation.navigate('Chat', {chatHeaderTitle: Name, teamId: item?._id})
      }>
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
const CreateChannelModel = ({modalizeRef, props}) => {
  const [title, setTitle] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  return (
    <Modalize
    adjustToContentHeight
      ref={modalizeRef}
      modalStyle={{top: '12%'}}
      scrollViewProps={{keyboardShouldPersistTaps:'always'}}
      >
      <View style={{margin: 12,height:500}}>
        <TextInput
          label={'Title'}
          mode={'outlined'}
          onChangeText={setTitle}
        />
        <TextInput
          label={'Members'}
          mode={'outlined'}
          onChangeText={setTitle}
        />
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
              );
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
  const navigation = useNavigation();
  const modalizeRef = useRef(null);
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
  return (
    <View style={{flex: 1, padding: 5}}>
      {props?.channelsState?.isLoading ? (
        <ActivityIndicator size={'large'} color={'black'} />
      ) : (
        <>
          {searchValue != '' ? (
            <FlatList
              data={props?.channelsByQueryState?.channels}
              renderItem={({item}) => (
                <RenderSearchChannels
                  item={item}
                  navigation={navigation}
                  props={props}
                />
              )}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
            />
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
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
            />
          )}
          {/* <FlatList
            data={props?.channelsState?.channels}
            renderItem={({item}) => (
              <RenderChannels
                item={item}
                navigation={navigation}
                props={props}
              />
            )}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
          /> */}
          <SearchBox
            searchValue={searchValue}
            changeText={changeText}
            isSearchFocus={false}
          />
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
        </>
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
    getChannelsStartAction: (token, orgId, userId) =>
      dispatch(getChannelsStart(token, orgId, userId)),
    getChannelsByQueryStartAction: (query, userToken, orgId) =>
      dispatch(getChannelsByQueryStart(query, userToken, orgId)),
    createNewChannelAction: (token, orgId, title, channelType) =>
      dispatch(createNewChannelStart(token, orgId, title, channelType)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChannelsScreen);
