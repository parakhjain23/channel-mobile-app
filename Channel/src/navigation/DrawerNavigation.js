import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import { Text } from 'react-native';
import OrgScreen from '../screens/orgScreen/OrgScreen';
const Drawer = createDrawerNavigator();

const CustomDrawer = () => {
    return <OrgScreen/>
}
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator drawerContent={(props)=><CustomDrawer/>}>
      <Drawer.Screen name="Org" component={OrgScreen} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigation;