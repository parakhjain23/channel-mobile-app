import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {getChatsReset} from '../../redux/actions/chat/ChatActions';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import {SIGN_OUT, UPDATE_APP_VERSION} from '../../redux/Enums';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreenComponent = ({
  setShowSplashScreen,
  fetchChatResetAction,
  networkState,
  setNewVersionOfApp,
  appInfoState,
  signOutAction,
}) => {
  const checkForApiUpdate = async () => {
    const version = DeviceInfo.getReadableVersion();
    if (appInfoState.appVersion === '' || appInfoState.appVersion !== version) {
      await AsyncStorage.clear();
      signOutAction();
      setNewVersionOfApp(version);
    }
  };
  useEffect(() => {
    checkForApiUpdate();
    networkState?.isInternetConnected && fetchChatResetAction();
    setTimeout(() => {
      SplashScreen.hide();
      setShowSplashScreen(false);
    }, 200);
  }, []);

  return (
    <></>
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <Image source={require('../../assests/images/appIcon/icon-96x96.png')} />
    //   <Text style={{textAlign: 'center'}}>Channel by Space</Text>
    // </View>
  );
};
const mapStateToProps = state => ({
  networkState: state.networkReducer,
  appInfoState: state.appInfoReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    fetchChatResetAction: () => dispatch(getChatsReset()),
    setNewVersionOfApp: version =>
      dispatch({type: UPDATE_APP_VERSION, version}),
    signOutAction: () => dispatch({type: SIGN_OUT}),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreenComponent);
