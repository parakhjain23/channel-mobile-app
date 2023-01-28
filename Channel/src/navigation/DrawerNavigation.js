import {
  createDrawerNavigator,
  DrawerContent,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React from 'react';
import {Text, View} from 'react-native';
import { connect } from 'react-redux';
import ChannelsScreen from '../screens/channelsScreen/ChannelsScreen';
import OrgScreen from '../screens/orgScreen/OrgScreen';
const Drawer = createDrawerNavigator();

const CustomDrawer = props => {
  return (
      <OrgScreen props={props} />
  );
};
const DrawerNavigation = ({userInfoState}) => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Channel"
        component={ChannelsScreen}
        options={({route}) => ({
          headerTitle: route?.params?.name || userInfoState.orgId,
        })}
      />
    </Drawer.Navigator>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
})
export default connect(mapStateToProps)(DrawerNavigation);
