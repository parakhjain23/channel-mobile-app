import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {getChannelsStart} from '../../redux/actions/channels/ChannelsAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBox from '../../components/searchBox';
import {useNavigation} from '@react-navigation/native';
import {FAB} from 'react-native-paper';
import {Modalize} from 'react-native-modalize';

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
const ChannelsScreen = props => {
  const [searchValue, setsearchValue] = useState('');
  const changeText = value => {
    setsearchValue(value);
  };
  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const CreateChannelModel = ({modalizeRef}) => {
    const [text, onChangeText] = React.useState('');
    return (
      <Modalize ref={modalizeRef} modalStyle={{top: '12%'}}>
        <View style={{margin: 12,alignContent:'center'}}>
          <Text>Title*</Text>
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              marginVertical: 10,
              padding: 10,
              borderRadius: 10,
            }}
            onChangeText={onChangeText}
            value={text}
            placeholder="Title"
            keyboardType="default"
          />
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              marginVertical: 10,
              padding: 10,
              borderRadius: 10,
            }}
            onChangeText={onChangeText}
            value={text}
            placeholder="Title"
            keyboardType="default"
          />
        </View>
        <Button title='Create Channel'/>
      </Modalize>
    );
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
              bottom: 100,
              right: 0,
              alignItems: 'flex-end',
            }}>
            <FAB
              onPress={onOpen}
              color={'grey'}
              uppercase={false}
              style={{}}
              label={`new channel`}
            />
          </View>
        </>
      )}
      <CreateChannelModel modalizeRef={modalizeRef} />
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChannelsScreen);
