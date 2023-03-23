import {
  createDrawerNavigator,
  DrawerContent,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {DrawerActions, useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import ChannelsScreen from '../screens/channelsScreen/ChannelsScreen';
import CustomeDrawerScreen from '../screens/drawer/CustomDrawerScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomDrawerScreen from '../screens/drawer/CustomDrawerScreen';

const Drawer = createDrawerNavigator();

const CustomDrawer = props => {
  return <CustomeDrawerScreen props={props} setScheme={setScheme} />;
};
const DrawerNavigation = ({orgsState, route}) => {
  const {setScheme} = route?.params;
  const {colors} = useTheme();
  var count = orgsState?.unreadCountForDrawerIcon;
  return (
    <Drawer.Navigator
      drawerContent={props => (
        <CustomDrawerScreen {...props} setScheme={setScheme} />
      )}>
      <Drawer.Screen
        name="Channel"
        component={ChannelsScreen}
        options={({route, navigation}) => ({
          headerTitle:
            orgsState.orgIdAndNameMapping != null
              ? orgsState?.orgIdAndNameMapping[orgsState?.currentOrgId]
              : 'Channel',
          headerStyle: {backgroundColor: colors.headerColor},
          headerTitleStyle: {color: colors.textColor},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
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
