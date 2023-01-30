import {
  createDrawerNavigator,
  DrawerContent,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React from 'react';
import {Text, View} from 'react-native';
import { connect } from 'react-redux';
import ChannelsScreen from '../screens/channelsScreen/ChannelsScreen';
import CustomeDrawerScreen from '../screens/drawer/CustomDrawerScreen';
const Drawer = createDrawerNavigator();

const CustomDrawer = props => {
  return (
      <CustomeDrawerScreen props={props} />
  );
};
const DrawerNavigation = ({userInfoState,orgsState}) => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Channel"
        component={ChannelsScreen}
        options={({route}) => ({
          headerTitle: orgsState.orgIdAndNameMapping!=null ? orgsState?.orgIdAndNameMapping[orgsState?.currentOrgId] : 'Channel',
        })}
      />
    </Drawer.Navigator>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgsState: state.orgsReducer
})
export default connect(mapStateToProps)(DrawerNavigation);
