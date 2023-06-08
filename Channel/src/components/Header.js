import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import * as RootNavigation from '../navigation/RootNavigation';
import {useTheme} from '@react-navigation/native';
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
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <Text style={{color: colors?.color, fontSize: 14}}>
          {chatHeaderTitle}
        </Text>
        <Entypo name="chevron-small-right" color={colors?.color} size={10} />
      </View>
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

  const UserImageComponent = ({userId, width = 40, height = 40}) => {
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

  const ChannelImageComponent = () => {
    const userImagesArray =
      channelsState?.channelIdAndDataMapping[teamId]?.userIds;
    let userImages = [];
    for (let i = 0; userImages?.length != 5; i++) {
      if (i > userImagesArray.length) {
        break;
      }
      const UserImage = orgState?.userIdAndImageUrlMapping[userImagesArray[i]];
      if (UserImage) {
        userImages?.push(userImagesArray[i]);
      }
    }
    //   ?.map(
    //     (userId, index) =>
    //       orgState?.userIdAndImageUrlMapping[userId] && (
    //         <UserImageComponent userId={userId} key={index} />
    //       ),
    //   );

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <View
            style={{
              alignItems: 'flex-end',
              marginBottom: 3,
            }}>
            {userImages[3] != null && (
              <UserImageComponent
                userId={userImages[3]}
                width={18}
                height={18}
              />
            )}
          </View>
          <View style={{marginBottom: -10}}>
            {userImages[1] != null && (
              <UserImageComponent
                userId={userImages[1]}
                width={30}
                height={30}
              />
            )}
          </View>
        </View>
        <View style={{marginHorizontal: 4}}>
          {userImages[0] != null && (
            <UserImageComponent userId={userImages[0]} width={45} height={45} />
          )}
        </View>
        <View style={{marginRight: 2}}>
          <View style={{marginTop: -10}}>
            {userImages[2] != null && (
              <UserImageComponent
                userId={userImages[2]}
                width={30}
                height={30}
              />
            )}
          </View>
          <View
            style={{
              alignItems: 'flex-start',
              marginTop: 3,
            }}>
            {userImages[4] != null && (
              <UserImageComponent
                userId={userImages[4]}
                width={18}
                height={18}
              />
            )}
          </View>
        </View>
        {userImagesArray?.length - userImages?.length > 0 && (
          <View>
            <Text style={{color: colors?.color, fontSize: 12}}>
              +{userImagesArray?.length - userImages?.length}
            </Text>
          </View>
        )}
      </View>
    );
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
          borderBottomColor: 'gray',
          borderBottomWidth: 0.5,
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
          <Icon name="chevron-left" size={18} color={colors?.color} />
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

export default React.memo(Header);
