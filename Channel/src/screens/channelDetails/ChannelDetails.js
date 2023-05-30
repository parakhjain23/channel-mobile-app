import React, {useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import SearchBox from '../../components/searchBox';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';
import {FlatList} from 'react-native';
import {
  addUserToChannelStart,
  removeUserFromChannelStart,
} from '../../redux/actions/channelActivities/inviteUserToChannelAction';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from './Styles';

const ChannelDetailsScreen = ({
  route,
  orgsState,
  userInfoState,
  getChannelsByQueryStartAction,
  channelsByQueryState,
  removeUserFromChannelAction,
  addUsersToChannelAction,
  channelsState,
}) => {
  const [searchValue, setsearchValue] = useState('');
  const {teamId} = route?.params;
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const RED_COLOR = '#FF2E2E';
  const GREEN_COLOR = '#00A300';

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
        item?._source?.type == 'U' &&
        item?._source?.isEnabled && (
          <View style={styles.userToAddContainer} key={item}>
            <Text style={styles.memberText}>{item?._source?.title}</Text>
            {channelsState?.channelIdAndDataMapping[teamId]?.userIds.includes(
              item?._source?.userId,
            ) ? (
              <TouchableOpacity
                onPress={() => {
                  removeUserFromChannelAction(
                    [item?._source?.userId],
                    channelsState?.channelIdAndDataMapping[teamId]?._id,
                    orgsState?.currentOrgId,
                    userInfoState?.accessToken,
                  );
                }}
                style={[
                  styles.buttonBorder,
                  {borderColor: RED_COLOR, backgroundColor: RED_COLOR},
                ]}>
                <Text style={{color: '#ffffff', fontWeight: '500'}}>
                  REMOVE
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  addUsersToChannelAction(
                    [item?._source?.userId],
                    channelsState?.channelIdAndDataMapping[teamId]?._id,
                    orgsState?.currentOrgId,
                    userInfoState?.accessToken,
                  );
                }}
                style={[
                  styles.buttonBorder,
                  {borderColor: GREEN_COLOR, backgroundColor: GREEN_COLOR},
                ]}>
                <Text style={{color: '#ffffff', fontWeight: '500'}}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      );
    },
    [channelsByQueryState?.channels, channelsState?.channelIdAndDataMapping],
  );

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.memberContainer} key={index}>
        <Text style={styles.memberText}>
          {orgsState?.userIdAndNameMapping[item]}
        </Text>
        <TouchableOpacity
          onPress={() => {
            removeUserFromChannelAction(
              [item],
              channelsState?.channelIdAndDataMapping[teamId]?._id,
              orgsState?.currentOrgId,
              userInfoState?.accessToken,
            );
          }}
          style={[
            styles.buttonBorder,
            {borderColor: RED_COLOR, backgroundColor: RED_COLOR},
          ]}>
          <Text style={{color: '#ffffff', fontWeight: '500'}}>REMOVE</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {channelsState?.channelIdAndDataMapping[teamId]?.purpose && (
          <Text style={styles.text}>
            Purpose: {channelsState?.channelIdAndDataMapping[teamId]?.purpose}
          </Text>
        )}
        {channelsState?.channelIdAndDataMapping[teamId]?.createdBy && (
          <Text style={styles.text}>
            Created by:{' '}
            {
              orgsState?.userIdAndNameMapping[
                channelsState?.channelIdAndDataMapping[teamId]?.createdBy
              ]
            }
          </Text>
        )}
        <Text style={styles.header}>Add Members </Text>
        <SearchBox
          searchValue={searchValue}
          changeText={changeText}
          isSearchFocus={false}
        />
        {searchValue != '' && channelsByQueryState?.channels?.length > 0 && (
          <FlatList
            data={channelsByQueryState?.channels}
            renderItem={RenderUsers}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => (
              <View style={{marginBottom: 100}}></View>
            )}
          />
        )}
        {searchValue?.length === 0 && (
          <View>
            <Text style={styles.header}>Members:</Text>
            <FlatList
              data={channelsState?.channelIdAndDataMapping[teamId]?.userIds}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                return <View style={{marginBottom: 100}}></View>;
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};
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
