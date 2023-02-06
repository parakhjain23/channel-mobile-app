import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Text,
  // TextInput,
  TouchableOpacity,
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
const CreateChannelModel = ({modalizeRef, props}) => {
  const [title, setTitle] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  const {TextInputRef} = useRef(false);
  return (
    <Modalize
      ref={modalizeRef}
      modalStyle={{top: '12%'}}
      childrenStyle={{flex: 1}}>
      <View style={{margin: 12}}>
        <TextInput
          ref={TextInputRef}
          label={'Title'}
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
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Button
        title="Create Channel"
        onPress={() => {
          props.createNewChannelAction(
            props?.userInfoState?.accessToken,
            props?.orgsState?.currentOrgId,
            title,
            channelType,
          );
          modalizeRef?.current?.close();
        }}
      />
    </Modalize>
  );
};
const ChannelsScreen = props => {
  const [searchValue, setsearchValue] = useState('');
  const changeText = value => {
    setsearchValue(value);
  };
  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const navigation = useNavigation();
  return (
    <View style={{flex: 1, padding: 5}}>
      {props?.channelsState?.isLoading ? (
        <ActivityIndicator size={'large'} color={'black'} />
      ) : (
        <>
          <FlatList
            data={props?.channelsState?.channels}
            renderItem={({item}) => (
              <RenderChannels
                item={item}
                navigation={navigation}
                props={props}
              />
            )}
          />
          <SearchBox
            searchValue={searchValue}
            changeText={changeText}
            isSearchFocus={false}
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 80,
              right: 0,
              alignItems: 'flex-end',
            }}>
            <FAB
              onPress={onOpen}
              color={'black'}
              animated={true}
              uppercase={false}
              style={{
                backgroundColor: '#4db8ff',
                margin:10
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
  userInfoState: state.userInfoReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    getChannelsStartAction: (token, orgId, userId) =>
      dispatch(getChannelsStart(token, orgId, userId)),
    createNewChannelAction: (token, orgId, title, channelType) =>
      dispatch(createNewChannelStart(token, orgId, title, channelType)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChannelsScreen);
