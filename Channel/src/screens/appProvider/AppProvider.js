import React, {createContext, useState} from 'react';
import { DEVICE_TYPES } from '../../constants/Constants';
import { Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';

export const AppContext = createContext();
const AppProvider = ({children,appInfoState}) => {
  // const {width, height} = Dimensions.get('window');
  // const isTablet = width >= 600 && height >= 600;
  // const isIPad = Platform.OS === 'ios' && Platform.isPad;
  // const deviceTypeLocal = isTablet || isIPad ? DEVICE_TYPES[1] : DEVICE_TYPES[0];

  // const [deviceType, setDeviceType] = useState(deviceTypeLocal)
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
