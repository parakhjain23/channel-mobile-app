import React, {useEffect, useState} from 'react';
import {Image, Platform, View} from 'react-native';
import {connect} from 'react-redux';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import jwt_decode from 'jwt-decode';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  getSpaceTokenStart,
  setSigningMethod,
} from '../../redux/actions/spaceToken/SpaceTokenActions';
import {useNavigation, useTheme} from '@react-navigation/native';

const LoginScreen = ({getSpaceTokenStartAction, setSigningMethodAction}) => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      offlineAccess: true,
      webClientId:
        '933098662176-klsnbscnurl42giegn4qkcenbqcdo6rh.apps.googleusercontent.com',
    });
  }, []);

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessTokken, idToken, user} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        idToken,
        accessTokken,
      );
      try {
        auth().onAuthStateChanged(data => {
          if (data) {
            data.getIdToken()?.then(token => {
              getSpaceTokenStartAction(token);
              setSigningMethodAction('Google');
              navigation.navigate('SelectWorkSpace', {email: user.email});
            });
          }
        });
      } catch (error) {
        // console.log(error);
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
        // console.log(error);
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
          let jwttokkenEmail = await jwt_decode(
            appleAuthRequestResponse?.identityToken,
          )?.email;
          try {
            auth().onAuthStateChanged(data => {
              if (data) {
                data?.getIdToken()?.then(token => {
                  getSpaceTokenStartAction(token);
                  setSigningMethodAction('Apple');
                  navigation.navigate('SelectWorkSpace', {
                    email: jwttokkenEmail,
                  });
                });
              }
            });
          } catch (error) {
            // console.log(error);
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
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.drawerBackgroundColor,
      }}>
      <Image source={require('../../assests/images/appIcon/icon96size.png')} />
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={_signIn}
      />
      {Platform.OS == 'ios' && (
        <View style={{marginTop: 10}}>
          <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: 192, // You must specify a width
              height: 48, // You must specify a height
            }}
            onPress={() => onAppleButtonPress()}
          />
        </View>
      )}
    </View>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    getSpaceTokenStartAction: firebaseToken =>
      dispatch(getSpaceTokenStart(firebaseToken)),
    setSigningMethodAction: signinMethod =>
      dispatch(setSigningMethod(signinMethod)),
  };
};
export default connect(null, mapDispatchToProps)(LoginScreen);
