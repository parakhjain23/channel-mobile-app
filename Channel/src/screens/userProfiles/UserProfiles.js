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
import {useNavigation} from '@react-navigation/native';


const ContactDetailsPage = ({userInfoState,channelsState}) => {
  const teamId = channelsState?.userIdAndTeamIdMapping[userInfoState?.searchedUserProfile?.id]
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View
        style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center'}}>
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
        <View>
          <Text style={[styles.phone,styles.buttonTextWhite]}>
            Phone :- {userInfoState?.searchedUserProfile?.mobileNumber}
          </Text>
        </View>
      )}
       <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {userInfoState?.searchedUserProfile?.mobileNumber && <TouchableOpacity style={[styles.button, styles.callButton]} onPress={()=>Linking.openURL(`tel:${userInfoState?.searchedUserProfile?.mobileNumber}`)}>
              <Text style={styles.buttonText}>
                Call {userInfoState?.searchedUserProfile?.displayName}
              </Text>
            </TouchableOpacity>}
            <TouchableOpacity style={[styles.button, styles.messageButton]} onPress={()=>navigation.navigate('Chat', {chatHeaderTitle: userInfoState?.searchedUserProfile?.displayName, teamId: teamId})}>
              <Text style={[styles.buttonText, styles.buttonTextWhite]}>
                Message {userInfoState?.searchedUserProfile?.displayName}
              </Text>
            </TouchableOpacity>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'black',
  },
  infoContainer: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'red',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B4B4B',
    marginBottom: 15,
    marginTop: 15,
  },
  email: {
    fontSize: 18,
    color: '#4B4B4B',
    marginBottom: 15,
  },
  phone: {
    fontSize: 18,
    color: '#4B4B4B',
    marginBottom: 20,
  },
  button: {
    height: 30,
    width: 150,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  callButton: {
    backgroundColor: 'white',
  },
  messageButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 14,
  },
  buttonTextWhite: {
    color: 'black',
  },
});
const mapStateToPros = state => ({
  userInfoState: state.userInfoReducer,
  channelsState : state.channelsReducer
});
export default connect(mapStateToPros)(ContactDetailsPage);
// export default ContactDetailsPage;
