import React, { useEffect, useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import { initializeSocket } from '../redux/actions/socket/socketActions';
import SplashScreen from '../screens/splashScreen/SplashScreen';
import AppWrapper from './AppWraper';
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
  return showSplashScreen ? (
    <SplashScreen setShowSplashScreen={setShowSplashScreen} />
  ) : (
      <AuthNavigation />
  );
};
const mapStateToProps = state => ({
  userInfoSate: state.userInfoReducer,
  orgsState: state.orgsReducer,
});
export default connect(mapStateToProps)(StoreAppWrapper);
