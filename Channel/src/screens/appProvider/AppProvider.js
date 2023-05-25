import React, {createContext, useState} from 'react';
import { DEVICE_TYPES } from '../../constants/Constants';
import { Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';

export const AppContext = createContext();
const AppProvider = ({children,appInfoState}) => {
  const deviceType = appInfoState?.deviceType
  return (
    <AppContext.Provider value={{deviceType}}>
      {children}
    </AppContext.Provider>
  );
};
const mapStateToProps = state => ({
  appInfoState: state.appInfoReducer,
});
export default connect(mapStateToProps)(AppProvider)
