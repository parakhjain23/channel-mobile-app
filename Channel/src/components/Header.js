import React from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import * as RootNavigation from '../navigation/RootNavigation';
import {useTheme} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {DEVICE_TYPES} from '../constants/Constants';

const HeaderComponent = ({
  chatHeaderTitle,
  userId,
  channelType,
  searchUserProfileAction,
  accessToken,
  teamId,
  orgState,
  channelsState,
  userInfoState,
  deviceType,
  setChatDetailsForTab,
}) => {
  const {colors} = useTheme();
  const handleGoBack = () => {
    RootNavigation?.goBack();
  };

  const HeaderTitle = ({chatHeaderTitle}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 1,
          marginRight: -7,
        }}>
        <Text
          style={{
            color: colors?.color,
            fontSize: 13,
            textAlignVertical: 'center',
          }}>
          {chatHeaderTitle}
          <Entypo name="chevron-small-right" color={colors?.color} size={13} />
        </Text>
      </View>
    );
  };
  const onTitlePress = (chatHeaderTitle, userId, channelType, accessToken) => {
    channelType === 'DIRECT_MESSAGE'
      ? (RootNavigation.navigate('UserProfiles', {
          displayName: chatHeaderTitle,
          userId: userId,
          setChatDetailsForTab: setChatDetailsForTab,
        }),
        searchUserProfileAction(userId, accessToken))
      : RootNavigation.navigate('ChannelDetails', {
          channelName: chatHeaderTitle,
          teamId: teamId,
        });
  };

  const MainComponent = () => {
    return (
      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          minHeight: 60,
          backgroundColor: colors?.headerColor,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.5,
        }}>
        {deviceType != DEVICE_TYPES[1] && (
          <TouchableOpacity
            onPress={handleGoBack}
            style={{
              paddingLeft: 15,
              paddingRight: 50,
              paddingVertical: 16,
              position: 'absolute',
              left: 0,
              bottom: 10,
              zIndex: 1,
            }}>
            <Icon name="chevron-left" size={15} color={colors?.color} />
          </TouchableOpacity>
        )}

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
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 1,
            }}>
            {channelType == 'DIRECT_MESSAGE' ? (
              <UserImageComponent userId={userId} orgState={orgState} />
            ) : (
              <ChannelHeaderImage
                userInfoState={userInfoState}
                teamId={teamId}
                orgState={orgState}
                channelsState={channelsState}
              />
            )}
            <HeaderTitle chatHeaderTitle={chatHeaderTitle} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  return (
    <>
      {platform !== 'ios' ? (
        <SafeAreaView style={{backgroundColor: colors?.headerColor}}>
          <MainComponent />
        </SafeAreaView>
      ) : (
        <MainComponent />
      )}
    </>
  );
};

export const UserImageComponent = ({
  userId,
  width = 30,
  height = 30,
  orgState,
}) => {
  return (
    <FastImage
      source={{
        uri: orgState?.userIdAndImageUrlMapping[userId]
          ? orgState?.userIdAndImageUrlMapping[userId]
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
        priority: FastImage.priority.normal,
      }}
      style={{
        width: width,
        height: height,
        borderRadius: 50,
      }}
    />
  );
};
const ChannelImageComponent = ({
  userInfoState,
  teamId,
  orgState,
  channelsState,
}) => {
  const {colors} = useTheme();
  const userImagesArray =
    channelsState?.channelIdAndDataMapping?.[teamId]?.userIds || [];
  let userImages = [];
  for (let i = 0; userImages?.length != 7; i++) {
    if (i > userImagesArray?.length) {
      break;
    }
    const UserImage = orgState?.userIdAndImageUrlMapping[userImagesArray[i]];
    if (UserImage) {
      userImages?.push(userImagesArray[i]);
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          // alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* first Left Image  */}
          <View style={{marginTop: -5, marginRight: 3}}>
            {userImages[5] != null && (
              <UserImageComponent
                userId={userImages[5]}
                width={8}
                height={8}
                orgState={orgState}
              />
            )}
          </View>
          <View>
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              {userImages[3] != null && (
                <UserImageComponent
                  userId={userImages[3]}
                  width={12}
                  height={12}
                  orgState={orgState}
                />
              )}
            </View>
            <View style={{marginTop: 2, marginLeft: -3}}>
              {userImages[1] != null && (
                <UserImageComponent
                  userId={userImages[1]}
                  width={14}
                  height={14}
                  orgState={orgState}
                />
              )}
            </View>
          </View>
        </View>
        {/* centered Image */}
        <View style={{marginHorizontal: 3}}>
          {userImages[0] != null && (
            <UserImageComponent
              userId={userImages[0]}
              width={28}
              height={28}
              orgState={orgState}
            />
          )}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <View style={{marginBottom: 1, marginLeft: 2}}>
              {userImages[2] != null && (
                <UserImageComponent
                  userId={userImages[2]}
                  width={14}
                  height={14}
                  orgState={orgState}
                />
              )}
            </View>
            <View
              style={{
                alignItems: 'flex-start',
              }}>
              {userImages[4] != null && (
                <UserImageComponent
                  userId={userImages[4]}
                  width={12}
                  height={12}
                  orgState={orgState}
                />
              )}
            </View>
          </View>
          <View style={{marginBottom: -5}}>
            {userImages[6] != null && (
              <UserImageComponent
                userId={userImages[6]}
                width={8}
                height={8}
                orgState={orgState}
              />
            )}
          </View>
        </View>
      </View>
      {userImagesArray?.length - userImages?.length > 0 && (
        <View style={{marginLeft: 3}}>
          <Text style={{color: colors?.color, fontSize: 8}}>
            +{userImagesArray?.length - userImages?.length}
          </Text>
        </View>
      )}
    </View>
  );
};
export const ChannelHeaderImage = React.memo(ChannelImageComponent);
export const Header = React.memo(HeaderComponent);
