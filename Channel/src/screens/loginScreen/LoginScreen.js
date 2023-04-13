import React, { useEffect, useState } from 'react';
import {Button, Image, Linking, Platform, Text, View} from 'react-native';
import { connect } from 'react-redux';
import {
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { getSpaceTokenStart } from '../../redux/actions/spaceToken/SpaceTokenActions';
import {useNavigation, useTheme} from '@react-navigation/native';

const LoginScreen = ({getSpaceTokenStartAction}) => {
  const navigation = useNavigation()
  const {colors} = useTheme();
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      offlineAccess: true,
      webClientId:
        '933098662176-klsnbscnurl42giegn4qkcenbqcdo6rh.apps.googleusercontent.com',
    });
  }, []);

  const _signIn = async userInfoState => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessTokken, idToken, user} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        idToken,
        accessTokken,
      );
      try {
        auth().onAuthStateChanged(data=>{
          if(data){
            data.getIdToken()?.then(token=>{
              console.log("this is token");
              getSpaceTokenStartAction(token)
              navigation.navigate('SelectWorkSpace')
            })
          }
        })
      } catch (error) {
        console.log(error);
      }
      return auth()
        .signInWithCredential(googleCredential)
        .catch(e => console.warn(e));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services Not Available or Outdated');
      } else {
        console.log(error);
        alert(error.message);
      }
    }
  };
  async function onAppleButtonPress() {
    {
      try {
        if (appleAuth?.isSupported) {
          let appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
          });
          const {identityToken, nonce} = appleAuthRequestResponse;
          const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce,
          );
          try {
            auth().onAuthStateChanged(data=>{
              if(data){
                data?.getIdToken()?.then(token=>{
                  console.log("this is token");
                  getSpaceTokenStartAction(token)
                  navigation.navigate('SelectWorkSpace')
                })
              }
            })
          } catch (error) {
            console.log(error);
          }
          return auth().signInWithCredential(appleCredential);
        } else {
          console.warn('INSIDE ELSE PART ');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:colors.drawerBackgroundColor}}>
      <Image source={require('../../assests/images/appIcon/icon-96x96.png')} />
      <Button
        title="Login with Google"
        onPress={
          _signIn
        }
      />
    { Platform.OS == 'ios' && <Button 
        title='Login with Apple'
        onPress={onAppleButtonPress}
      />}
    </View>
  );
};
const mapStateToProps = state => ({
  userInfoSate: state.userInfoReducer,
});
const mapDispatchToProps = dispatch =>{
  return {
    getSpaceTokenStartAction : (firebaseToken) => dispatch(getSpaceTokenStart(firebaseToken)),
    // saveUserTokenAction :(token,orgId)=> dispatch(saveUserToken(token,orgId)),
    // getOrgDetailsAction: (token) => dispatch(getOrgDetailsStart(token)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);