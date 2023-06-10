import React, {useEffect} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import {DEVICE_TYPES, IMAGE_BASE_URL} from '../../constants/Constants';
import {useNavigation, useTheme} from '@react-navigation/native';
import {makeStyles} from './Styles';
import {ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedLottieView from 'lottie-react-native';
import {s, vs, ms, mvs} from 'react-native-size-matters';
import {createNewDmChannelStart} from '../../redux/actions/channels/CreateNewDmChannelAction';
import {Button} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import signOut from '../../redux/actions/user/userAction';

const ContactDetailsPage = ({
  userInfoState,
  channelsState,
  createDmChannelAction,
  signOutAction,
  orgsState,
  route,
  appInfoState,
}) => {
  const {displayName, userId, setChatDetailsForTab} = route?.params;
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const teamId =
    channelsState?.userIdAndTeamIdMapping[
      userInfoState?.searchedUserProfile?.id
    ];
  const navigation = useNavigation();
  const handleListItemPress = (
    teamId,
    channelType,
    userId,
    searchedChannel,
  ) => {
    setChatDetailsForTab({
      teamId: teamId,
      channelType: channelType,
      userId: userId,
      searchedChannel: searchedChannel,
    });
  };
  useEffect(() => {
    if (userInfoState?.searchedUserProfile != null) {
      if (teamId == undefined) {
        createDmChannelAction(
          userInfoState?.accessToken,
          orgsState?.currentOrgId,
          '',
          userInfoState?.searchedUserProfile?.id,
        );
      }
    }
  }, [userInfoState?.searchedUserProfile]);
  let FirstName = '',
    LastName = '',
    Email = '',
    MobileNumber = '',
    Avtar = '',
    DisplayName = '',
    UserId = '';
  if (userId === userInfoState?.user?.id) {
    Email = userInfoState?.user?.email;
    FirstName = userInfoState?.user?.firstName;
    LastName = userInfoState?.user?.lastName;
    MobileNumber = userInfoState?.user?.mobileNumber;
    Avtar = userInfoState?.user?.avatarKey;
    DisplayName = displayName;
    UserId = userId;
  } else {
    Email = userInfoState?.searchedUserProfile?.email;
    FirstName = userInfoState?.searchedUserProfile?.firstName;
    LastName = userInfoState?.searchedUserProfile?.lastName;
    MobileNumber = userInfoState?.searchedUserProfile?.mobileNumber;
    Avtar = userInfoState?.searchedUserProfile?.avatarKey;
    DisplayName = userInfoState?.searchedUserProfile?.displayName;
    UserId = userInfoState?.searchedUserProfile?.id;
  }

  const _signOut = async () => {
    if (userInfoState?.siginInMethod == 'Google') {
      await GoogleSignin.signOut();
    }
    signOutAction();
  };

  return (
    <View style={styles.container}>
      {userInfoState?.isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <AnimatedLottieView
            source={require('../../assests/images/attachments/loading.json')}
            loop
            autoPlay
            style={{height: s(100), width: s(100)}}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri:
                  (Avtar && `${IMAGE_BASE_URL}${Avtar}`) ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
              }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 5,
                marginBottom: 20,
              }}
            />
          </View>
          <Text style={styles.name}>
            <Icon name="user" size={16} color={colors.textColor} />
            {'  '}
            {FirstName} {LastName}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `mailto:${userInfoState?.searchedUserProfile?.email}`,
              )
            }>
            <Text style={[styles.email]}>
              <Icon name="envelope" size={16} color={colors.textColor} />
              {'  '}
              {Email}
            </Text>
          </TouchableOpacity>
          {userInfoState?.searchedUserProfile?.mobileNumber && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${MobileNumber}`)}>
              <View style={styles.email}>
                <Text style={[styles.email]}>
                  <Icon name="phone" size={16} color={colors.textColor} />
                  {'  '}
                  {MobileNumber}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {userId != userInfoState?.user?.id && (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                style={[styles.button, styles.messageButton]}
                onPress={async () => {
                  appInfoState.deviceType == DEVICE_TYPES[0]
                    ? navigation.navigate('Chat', {
                        chatHeaderTitle: DisplayName,
                        teamId: teamId,
                        channelType:
                          channelsState?.teamIdAndTypeMapping[teamId],
                        userId: UserId,
                      })
                    : (handleListItemPress(
                        teamId,
                        channelsState?.teamIdAndTypeMapping[teamId],
                        UserId,
                        false,
                      ),
                      navigation.goBack());
                }}>
                <Text style={[styles.buttonText, styles.buttonTextWhite]}>
                  Message {DisplayName}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
      {userId == userInfoState?.user?.id && (
        <View
          style={{
            borderTopColor: 'gray',
            // borderTopWidth: 0.3,
            justifyContent: 'center',
            marginBottom: 40,
          }}>
          <Button title="Sign Out" onPress={_signOut} />
        </View>
      )}
    </View>
  );
};

const mapStateToPros = state => ({
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
  orgsState: state.orgsReducer,
  appInfoState: state.appInfoReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    createDmChannelAction: (token, orgId, title, reciverUserId) =>
      dispatch(createNewDmChannelStart(token, orgId, title, reciverUserId)),
    signOutAction: () => dispatch(signOut()),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(ContactDetailsPage);
// export default ContactDetailsPage;
