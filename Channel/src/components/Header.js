import React, {useState} from 'react';
import {View, Animated, Text, Dimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as RootNavigation from '../navigation/RootNavigation';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';

const Header = ({
  chatHeaderTitle,
  userId,
  channelType,
  searchUserProfileAction,
  accessToken,
  teamId,
  orgState,
  channelsState,
}) => {
  const {colors} = useTheme();
  const handleGoBack = () => {
    RootNavigation?.goBack();
  };

  const HeaderTitle = ({chatHeaderTitle}) => {
    return (
      <Text style={{color: colors?.color, fontSize: 12, margin: 5}}>
        {chatHeaderTitle}
      </Text>
    );
  };
  const onTitlePress = (chatHeaderTitle, userId, channelType, accessToken) => {
    channelType === 'DIRECT_MESSAGE'
      ? (RootNavigation.navigate('UserProfiles', {
          displayName: chatHeaderTitle,
          userId: userId,
        }),
        searchUserProfileAction(userId, accessToken))
      : RootNavigation.navigate('ChannelDetails', {
          channelName: chatHeaderTitle,
          teamId: teamId,
        });
  };

  const UserImageComponent = ({userId}) => {
    return (
      <FastImage
        source={{
          uri: orgState?.userIdAndImageUrlMapping[userId]
            ? orgState?.userIdAndImageUrlMapping[userId]
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
          priority: FastImage.priority.normal,
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 50,
        }}
      />
    );
  };

  const ChannelImageComponent = () => {
    const userImages = channelsState?.channelIdAndDataMapping[teamId]?.userIds
      ?.slice(0, 5)
      ?.map(
        (userId, index) =>
          orgState?.userIdAndImageUrlMapping[userId] && (
            <UserImageComponent userId={userId} key={index} />
          ),
      );

    return <View style={{flexDirection: 'row'}}>{userImages}</View>;
  };

  return (
    <SafeAreaView style={{backgroundColor: colors?.headerColor}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          minHeight: 50,
          backgroundColor: colors?.headerColor,
        }}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={{
            paddingLeft: 20,
            paddingRight: 50,
            paddingVertical: 16,
            position: 'absolute',
            left: 0,
            zIndex: 1,
          }}>
          <Icon name="chevron-left" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{flex: 1}} // don't remove it bcz of this full header is touchable
          onPress={() => {
            onTitlePress(
              chatHeaderTitle,
              userId,
              channelType,
              accessToken,
              teamId,
            );
          }}>
          <View
            style={{
              // flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 5,
            }}>
            {channelType == 'DIRECT_MESSAGE' ? (
              <UserImageComponent userId={userId} />
            ) : (
              <ChannelImageComponent />
            )}
            <HeaderTitle chatHeaderTitle={chatHeaderTitle} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
