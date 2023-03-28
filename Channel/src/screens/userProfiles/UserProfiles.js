import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import {IMAGE_BASE_URL} from '../../constants/Constants';
import {useNavigation, useTheme} from '@react-navigation/native';
import {makeStyles} from './Styles';
import {ScrollView} from 'react-native';

const ContactDetailsPage = ({userInfoState, channelsState}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const teamId =
    channelsState?.userIdAndTeamIdMapping[
      userInfoState?.searchedUserProfile?.id
    ];
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Image
            source={{
              uri: `${IMAGE_BASE_URL}${userInfoState?.searchedUserProfile?.avatarKey}`,
            }}
            style={{width: 150, height: 150, borderRadius: 5, marginBottom: 20}}
          />
        </View>
        <Text style={styles.name}>
          Name :- {userInfoState?.searchedUserProfile?.firstName}{' '}
          {userInfoState?.searchedUserProfile?.lastName}
        </Text>
        <Text style={styles.email}>
          Email :- {userInfoState?.searchedUserProfile?.email}
        </Text>
        {userInfoState?.searchedUserProfile?.mobileNumber && (
          <View style={styles.email}>
            <Text style={[styles.email]}>
              Phone :- {userInfoState?.searchedUserProfile?.mobileNumber}
            </Text>
          </View>
         )}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {userInfoState?.searchedUserProfile?.mobileNumber && (
            <TouchableOpacity
              style={[styles.button, styles.callButton]}
              onPress={() =>
                Linking.openURL(
                  `tel:${userInfoState?.searchedUserProfile?.mobileNumber}`,
                )
              }>
              <Text style={styles.buttonText}>
                Call {userInfoState?.searchedUserProfile?.displayName}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.messageButton]}
            onPress={() =>
              navigation.navigate('Chat', {
                chatHeaderTitle:
                  userInfoState?.searchedUserProfile?.displayName,
                teamId: teamId,
              })
            }>
            <Text style={[styles.buttonText, styles.buttonTextWhite]}>
              Message {userInfoState?.searchedUserProfile?.displayName}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToPros = state => ({
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
});
export default connect(mapStateToPros)(ContactDetailsPage);
// export default ContactDetailsPage;
