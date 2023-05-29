import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import SearchBox from '../../components/searchBox';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';
import {FlatList} from 'react-native';
import {RenderUsersToAdd} from '../channelsScreen/ChannelCard';
import {addUserToChannelStart, removeUserFromChannelStart} from '../../redux/actions/channelActivities/inviteUserToChannelAction';

const ChannelDetailsScreen = ({
  route,
  orgsState,
  userInfoState,
  getChannelsByQueryStartAction,
  channelsByQueryState,
  removeUserFromChannelAction,
  addUsersToChannelAction,
  channelsState
}) => {
  const [searchValue, setsearchValue] = useState('');
  const {teamId} = route?.params;
    // const [userIds, setuserIds] = useState(data?.userIds)
  const changeText = value => {
    setsearchValue(value);
  };
  useEffect(() => {
    if (searchValue != '') {
      getChannelsByQueryStartAction(
        searchValue,
        userInfoState?.user?.id,
        orgsState?.currentOrgId,
      );
    }
  }, [searchValue]);
  const RenderUsers = useCallback(
    ({item}) => {
      return (
        item?._source?.type == 'U' && (
          <View style={styles.userToAddContainer} key={item}>
            <Text style={styles.memberText}>{item?._source?.title}</Text>
            {channelsState?.channelIdAndDataMapping[teamId]?.userIds.includes(item?._source?.userId) ? (
              <TouchableOpacity style={{borderWidth: 1, borderColor: 'black'}} onPress={()=>{
                removeUserFromChannelAction([item?._source?.userId],channelsState?.channelIdAndDataMapping[teamId]?._id,orgsState?.currentOrgId,userInfoState?.accessToken)
                // setuserIds(userIds?.filter((id)=> id != item?._source?.userId))
              }} >
                <Text style={{marginHorizontal: 5}}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{borderWidth: 1, borderColor: 'black'}} onPress={()=>{
                addUsersToChannelAction([item?._source?.userId],channelsState?.channelIdAndDataMapping[teamId]?._id,orgsState?.currentOrgId,userInfoState?.accessToken)
                // setuserIds([item?._source?.userId, ...userIds])
              }}>
                <Text style={{marginHorizontal: 5}}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      );
    },
    [channelsByQueryState?.channels,channelsState?.channelIdAndDataMapping],
  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {channelsState?.channelIdAndDataMapping[teamId]?.purpose && (
          <Text style={styles.text}>Purpose: {channelsState?.channelIdAndDataMapping[teamId]?.purpose}</Text>
        )}
        {channelsState?.channelIdAndDataMapping[teamId]?.createdBy && (
          <Text style={styles.text}>
            Created by: {orgsState?.userIdAndNameMapping[channelsState?.channelIdAndDataMapping[teamId]?.createdBy]}
          </Text>
        )}
        <Text style={styles.header}>Add Members </Text>
        <SearchBox
          searchValue={searchValue}
          changeText={changeText}
          isSearchFocus={false}
        />
        {searchValue != '' && channelsByQueryState?.channels?.length > 0 && (
          <View style={{maxHeight: 200}}>
            <FlatList
              data={channelsByQueryState?.channels}
              renderItem={RenderUsers}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
            />
          </View>
        )}
        <Text style={styles.header}>Members:</Text>
        {channelsState?.channelIdAndDataMapping[teamId]?.userIds?.map(item => (
          <View style={styles.memberContainer} key={item}>
            <Text style={styles.memberText}>
              {orgsState?.userIdAndNameMapping[item]}
            </Text>
            <TouchableOpacity style={{borderWidth: 1, borderColor: 'black'}} onPress={()=>{
                 removeUserFromChannelAction([item],channelsState?.channelIdAndDataMapping[teamId]?._id,orgsState?.currentOrgId,userInfoState?.accessToken)
                //  setuserIds(userIds?.filter((id)=> id != item))
            }}>
              <Text style={{marginHorizontal: 5}}>REMOVE</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  memberContainer: {
    flexDirection: 'row',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  userToAddContainer: {
    flexDirection: 'row',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    marginBottom: 1,
    justifyContent: 'space-between',
  },
  memberText: {
    fontSize: 16,
    color: '#333',
  },
});
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
  orgsState: state.orgsReducer,
  appInfoState: state.appInfoReduer,
  channelsByQueryState: state.channelsByQueryReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    getChannelsByQueryStartAction: (query, userToken, orgId) =>
      dispatch(getChannelsByQueryStart(query, userToken, orgId)),
    removeUserFromChannelAction: (userIds, teamId, orgId, accessToken) =>
      dispatch(removeUserFromChannelStart(userIds, teamId, orgId, accessToken)),
    addUsersToChannelAction: (userIds, teamId, orgId, accessToken) =>
      dispatch(addUserToChannelStart(userIds, teamId, orgId, accessToken)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelDetailsScreen);
