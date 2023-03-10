import React from 'react';
import {Text, TouchableOpacity, View, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {fetchSearchedUserProfileStart} from '../../redux/actions/user/searchUserProfileActions';

const ChannelCard = ({item, navigation, props}) => {
  // console.log('channelcard');
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
  const iconName = item?.type == 'DIRECT_MESSAGE' ? 'user' : 'hashtag';
  var nameFontWeight;
  props?.channelsState?.highlightChannel[item?._id] != undefined
    ? (nameFontWeight = props?.channelsState?.highlightChannel[item?._id]
        ? '600'
        : '400')
    : '400';
  return (
    <TouchableOpacity
      style={{
        // borderBottomWidth: 0.5,
        borderWidth: 0.5,
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
        <Icon name={iconName} size={14} color="black" />
        <Text
          style={{fontSize: 16, fontWeight: nameFontWeight, color: 'black'}}>
          {' '}
          {Name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const SearchChannelCard = ({
  item,
  navigation,
  props,
  setsearchValue,
  userInfoState,
  searchUserProfileAction,
  orgsState
}) => {
  const Name =
    item?._source?.type == 'U'
      ? item?._source?.title
      : '#' + item?._source?.title;
  const teamId = item?._id?.includes('_')
    ? props?.channelsState?.userIdAndTeamIdMapping[item?._source?.userId]
    : item?._id;
  const iconName = item?._source?.type == 'U' ? 'user' : 'hashtag';
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
        <Icon name={iconName} color={'black'} />
        <Text style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
          {' '}
          {Name}
        </Text>
        <View style={{position: 'absolute', left: undefined, right: 20}}>
          {item?._source?.type == 'U' && (
            <Button
              title="Profile"
              onPress={async () => {
                await searchUserProfileAction(item?._source?.userId,userInfoState?.accessToken)
                navigation.navigate('UserProfiles', {
                  displayName:orgsState?.userIdAndDisplayNameMapping[item?._source?.userId],
                });
              }}></Button>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const UsersToAddCard = ({item, setUserIds, userIds, setsearchedUser}) => {
  const Name = item?._source?.type == 'U' && item?._source?.title;
  return (
    item?._source?.type == 'U' && (
      <TouchableOpacity
        style={{
          borderWidth: 0.4,
          borderColor: 'gray',
          borderRadius: 3,
          minHeight: 60,
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
          <Icon name="user" color={'black'} />
          <Text style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
            {' '}
            {Name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgsState: state.orgsReducer
});
const mapDispatchToProps = dispatch => {
  return {
    searchUserProfileAction: (userId, token) =>
      dispatch(fetchSearchedUserProfileStart(userId, token)),
  };
};
export const RenderChannels = React.memo(ChannelCard);
export const RenderSearchChannels = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SearchChannelCard),
);
export const RenderUsersToAdd = React.memo(UsersToAddCard);
