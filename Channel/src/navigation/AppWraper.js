import React from 'react'
import AuthNavigation from './AuthNavigation';
const AppWrapper = () => {
    return (
        <AuthNavigation />
    )
  return (appInfoState.isNetConnected ?
      (appInfoState.isAppOpenedFirstTime ? <FirstTimeAppOpenScreen /> :
        ((!userInfoState.guest && userInfoState.user == null ) ? <LoginScreen />
          : (userInfoState.askCity ? <AskCity/> : <AuthNavigation />)) ): <NoInternet />
    );
}
export default AppWrapper;