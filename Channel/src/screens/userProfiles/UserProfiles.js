import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';
import {IMAGE_BASE_URL} from '../../constants/Constants';


const ContactDetailsPage = ({userInfoState}) => {
    // var {name,phone,email,imageUrl} = route.params
    console.log(userInfoState?.searchedUserProfile);
  return (
    <View style={styles.container}>
        <View style={{marginTop:20,flexDirection:'row',justifyContent:'center'}}>
        <Image
            source={{uri: `${IMAGE_BASE_URL}${userInfoState?.searchedUserProfile?.avatarKey}`}}
            style={{width: 150, height: 150, borderRadius:5, marginBottom: 20}}
          />
        </View>
      <View style={{}}>
        <Text style={styles.name}>Name :- {userInfoState?.searchedUserProfile?.firstName} {userInfoState?.searchedUserProfile?.lastName}</Text>
        <Text style={styles.email}>Email :- {userInfoState?.searchedUserProfile?.email}</Text>
       {userInfoState?.searchedUserProfile?.mobileNumber &&  <TouchableOpacity onPress={()=>Linking.openURL(`tel:${userInfoState?.searchedUserProfile?.mobileNumber}`)}>
        <Text style={styles.phone}>Phone :- {userInfoState?.searchedUserProfile?.mobileNumber}</Text>
        </TouchableOpacity>}
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
    borderWidth:2,
    borderColor:'black',
    backgroundColor:'red',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B4B4B',
    marginBottom: 15,
    marginTop:15
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
});
const mapStateToPros = state =>({
    userInfoState :state.userInfoReducer
})
export default connect(mapStateToPros)(ContactDetailsPage)
// export default ContactDetailsPage;