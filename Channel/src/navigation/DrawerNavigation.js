import {createDrawerNavigator, DrawerContent, DrawerContentScrollView} from '@react-navigation/drawer';
import React from 'react';
import { Text, View } from 'react-native';
import ChannelsScreen from '../screens/channelsScreen/ChannelsScreen';
import OrgScreen from '../screens/orgScreen/OrgScreen';
const Drawer = createDrawerNavigator();

const CustomDrawer = () => {
    return (
        // <OrgScreen/>
        <DrawerContentScrollView>
            <OrgScreen/>
        </DrawerContentScrollView>
    )
}
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator drawerContent={(props)=><CustomDrawer/>}>
      <Drawer.Screen name="Channel" component={ChannelsScreen} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigation;