import React, { useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import SplashScreen from '../screens/splashScreen/SplashScreen';
import AppWrapper from './AppWraper';


const StoreAppWrapper = ({userInfoState, channelsState, orgsState}) => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const dispatch = useDispatch();
  return showSplashScreen ? (
    <SplashScreen setShowSplashScreen={setShowSplashScreen} />
  ) : (
      <AppWrapper />
  );
};
const mapStateToProps = state => ({
  orgsState: state.orgsReducer,
  channelsState: state.channelsReducer,
  userInfoState: state.userInfoReducer,
});

export default connect(mapStateToProps)(StoreAppWrapper);
