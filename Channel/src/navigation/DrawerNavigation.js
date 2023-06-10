import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerActions, useTheme} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import ChannelsScreen from '../screens/channelsScreen/ChannelsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomDrawerScreen from '../screens/drawer/CustomDrawerScreen';
import IpadScreen from '../screens/ipadScreen/IpadScreen';
import {DEVICE_TYPES} from '../constants/Constants';

const Drawer = createDrawerNavigator();
const DrawerNavigation = ({orgsState, appInfoState}) => {
  const {colors} = useTheme();
  var count = orgsState?.unreadCountForDrawerIcon;
  let ScreenName, ScreenComponent;
  const deviceType = appInfoState.deviceType;
  if (deviceType === DEVICE_TYPES[0]) {
    [ScreenName, ScreenComponent] = ['Channel', ChannelsScreen];
  } else {
    [ScreenName, ScreenComponent] = ['Ipad', IpadScreen];
  }

  return (
    <Drawer.Navigator
      drawerContent={props => (
        <CustomDrawerScreen {...props} deviceType={deviceType} />
      )}>
      <Drawer.Screen
        name={ScreenName}
        component={ScreenComponent}
        options={({route, navigation}) => ({
          headerTitle:
            orgsState.orgIdAndNameMapping != null
              ? orgsState?.orgIdAndNameMapping[orgsState?.currentOrgId]
              : 'Channel',
          headerStyle: {backgroundColor: colors.headerColor},
          headerTitleStyle: {color: colors.textColor},
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flex: 1,
                marginRight: 0,
                justifyContent: 'center',
                paddingRight: Platform?.OS == 'ios' ? 45 : 20,
              }}
              onPressIn={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <View style={styles.container}>
                <Icon name="bars" size={24} color={colors.secondaryColor} />
                {count > 0 && (
                  <View style={styles.counter}>
                    <Text style={styles.counterText}>{count}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgsState: state.orgsReducer,
  appInfoState: state.appInfoReducer,
});
export default connect(mapStateToProps)(DrawerNavigation);
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginLeft: 15,
  },
  counter: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
