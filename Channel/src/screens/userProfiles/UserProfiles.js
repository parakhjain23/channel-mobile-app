import React, { useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedLottieView from 'lottie-react-native';
import {s, vs, ms, mvs} from 'react-native-size-matters';
import { createNewDmChannelStart } from '../../redux/actions/channels/CreateNewDmChannelAction';

const ContactDetailsPage = ({userInfoState, channelsState,createDmChannelAction,orgsState}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const teamId =
    channelsState?.userIdAndTeamIdMapping[
      userInfoState?.searchedUserProfile?.id
    ];
  const navigation = useNavigation();
   useEffect(() => {
      if(userInfoState?.searchedUserProfile != null){
        if(teamId == undefined){
          createDmChannelAction(userInfoState?.accessToken,orgsState?.currentOrgId,'',userInfoState?.searchedUserProfile?.id)
        }
      }
   }, [userInfoState?.searchedUserProfile])
   

    
  return (
    <View style={styles.container}>
      {userInfoState?.isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <AnimatedLottieView
            source={require('../../assests/images/attachments/loading.json')}
            loop
            autoPlay
            style={{height: s(500), width: s(500)}}
          />
        </View>
      ) : (
        <ScrollView>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: userInfoState?.searchedUserProfile?.avatarKey
                  ? `${IMAGE_BASE_URL}${userInfoState?.searchedUserProfile?.avatarKey}`
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
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
            {userInfoState?.searchedUserProfile?.firstName}{' '}
            {userInfoState?.searchedUserProfile?.lastName}
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
              {userInfoState?.searchedUserProfile?.email}
            </Text>
          </TouchableOpacity>
          {userInfoState?.searchedUserProfile?.mobileNumber && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `tel:${userInfoState?.searchedUserProfile?.mobileNumber}`,
                )
              }>
              <View style={styles.email}>
                <Text style={[styles.email]}>
                  <Icon name="phone" size={16} color={colors.textColor} />
                  {'  '}
                  {userInfoState?.searchedUserProfile?.mobileNumber}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={[styles.button, styles.messageButton]}
              onPress={async () =>
                {
                  navigation.navigate('Chat', {
                  chatHeaderTitle:
                    userInfoState?.searchedUserProfile?.displayName,
                  teamId: teamId,
                })}
              }>
              <Text style={[styles.buttonText, styles.buttonTextWhite]}>
                Message {userInfoState?.searchedUserProfile?.displayName}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToPros = state => ({
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
  orgsState: state.orgsReducer
});
const mapDispatchToProps = dispatch =>{
  return{
    createDmChannelAction: (token, orgId, title, reciverUserId) =>
      dispatch(createNewDmChannelStart(token, orgId, title, reciverUserId)),
  }
}
export default connect(mapStateToPros,mapDispatchToProps)(ContactDetailsPage);
// export default ContactDetailsPage;
