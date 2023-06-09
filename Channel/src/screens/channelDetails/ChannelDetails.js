import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
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
  const {teamId, channelName} = route?.params;
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const RED_COLOR = '#FF2E2E';
  const GREEN_COLOR = '#00A300';
  const Purpose = channelsState?.channelIdAndDataMapping?.[teamId]?.purpose;
  const CreatedBy = channelsState?.channelIdAndDataMapping[teamId]?.createdBy;
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
                    [{userId: item?._source?.userId}],
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
                    [{userId: item?._source?.userId}],
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

  const RenderItem = ({item, index}) => {
    return (
      <View style={styles.memberContainer} key={index}>
        <Text style={styles.memberText}>
          {orgsState?.userIdAndNameMapping[item]}
        </Text>
        <TouchableOpacity
          onPress={() => {
            removeUserFromChannelAction(
              [{userId: item}],
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
    <ScrollView style={{flex: 1, backgroundColor: colors?.primaryColor}}>
      <View style={styles.container}>
        <View style={styles.content}>
          {Purpose?.length > 0 && (
            <Text style={styles.text}>
              Purpose:{' '}
              {channelsState?.channelIdAndDataMapping[
                teamId
              ]?.purpose?.toString()}
            </Text>
          )}
          {CreatedBy?.length > 0 && (
            <Text>
              <Text style={styles.text}>
                Created by:{' '}
                {
                  orgsState?.userIdAndNameMapping[
                    channelsState?.channelIdAndDataMapping[teamId]?.createdBy
                  ]
                }
              </Text>
            </Text>
          )}

          <Text style={styles.header}>Add Members </Text>
          <SearchBox
            searchValue={searchValue}
            changeText={changeText}
            isSearchFocus={false}
          />

          {searchValue != '' &&
            channelsByQueryState?.channels?.length > 0 &&
            channelsByQueryState?.channels?.map((item, index) => {
              return <RenderUsers item={item} key={index} />;
            })}

          {searchValue?.length === 0 && (
            <View style={{flex: 1}}>
              <Text style={styles.header}>Members:</Text>
              {channelsState?.channelIdAndDataMapping[teamId]?.userIds?.map(
                (item, index) => {
                  return <RenderItem item={item} index={index} key={index} />;
                },
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
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
