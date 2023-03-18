import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import { networkStatus } from '../redux/actions/network/NetworkActions';
import { initializeSocket } from '../redux/actions/socket/socketActions';
import SplashScreenComponent from '../screens/splashScreen/SplashScreen';
import AuthNavigation from './AuthNavigation';


const StoreAppWrapper = ({userInfoSate,orgsState}) => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if(userInfoSate?.accessToken){
      dispatch(
        initializeSocket(userInfoSate?.accessToken, orgsState?.currentOrgId),
      );
    }
  }, [userInfoSate?.accessToken, orgsState?.currentOrgId]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      dispatch(networkStatus(state?.isConnected));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return showSplashScreen ? (
    <SplashScreenComponent setShowSplashScreen={setShowSplashScreen}/>
    // <SplashScreen setShowSplashScreen={setShowSplashScreen} />
  ) : (
      <AuthNavigation />
  );
};
const mapStateToProps = state => ({
  userInfoSate: state.userInfoReducer,
  orgsState: state.orgsReducer,
});
export default connect(mapStateToProps)(StoreAppWrapper);
