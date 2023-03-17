import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Button,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {IMAGE_BASE_URL} from '../../constants/Constants';
import {getChannelsStart, moveChannelToTop} from '../../redux/actions/channels/ChannelsAction';
import {switchOrgStart} from '../../redux/actions/org/changeCurrentOrg';
import { moveMultipleChannelsToTop, removeCountOnOrgCard } from '../../redux/actions/org/UnreadCountOnOrgCardsAction';
import signOut from '../../redux/actions/user/userAction';

const CustomeDrawerScreen = ({
  orgsState,
  userInfoState,
  channelsState,
  getChannelsAction,
  switchOrgAction,
  signOutAction,
  removeCountOnOrgCardAction,
  moveChannelToTopAction
}) => {
  const data = orgsState?.orgs;
  const navigation = useNavigation();
  useEffect(() => {
    if (userInfoState?.user != null && channelsState?.channels?.length == 0) {
      getChannelsAction(
        userInfoState?.accessToken,
        orgsState?.currentOrgId,
        userInfoState?.user?.id,
      );
    }
  }, [userInfoState?.user]);
  const OrgCard = ({item, navigation}) => {
    var unreadCountObj = orgsState?.orgsWithNewMessages[item?.id]
    var count = undefined
    if(unreadCountObj != undefined){
      count = Object.keys(unreadCountObj).length
      if(count>9){
        count = '9+'
      }
    }
    return (
      <TouchableOpacity
        onPress={async () => {
        await switchOrgAction(
            userInfoState?.accessToken,
            item?.id,
            userInfoState?.user?.id,
            );  
          count != undefined && await moveChannelToTopAction(Object.keys(unreadCountObj)) && removeCountOnOrgCardAction(item?.id)
          navigation.navigate('Channel', {orgId: item?.id, name: item?.name});
        }}
        style={{
          borderWidth: 0.5,
          borderColor: 'gray',
          borderRadius: 5,
          marginVertical: '1%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 8,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={
                item?.iconKey
                  ? {uri: `${IMAGE_BASE_URL}${item.iconKey}`}
                  : require('../../assests/images/appIcon/icon-48x48.png')
              }
              style={{height: 40, width: 40, marginRight: 10}}
            />
            <Text style={{color: 'black'}}>{item?.name}</Text>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          {count !=undefined && (
            <View
              style={{
                backgroundColor: 'red',
                borderRadius: 50,
                height: 20,
                minWidth: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Text style={{color: 'white', fontSize: 12}}>{count}</Text>
            </View>
          )}
            <Icon name="chevron-right" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: '3%',
        paddingTop: '8%',
        paddingHorizontal: '3%',
      }}>
      <View style={{flex: 0.15, justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: `${IMAGE_BASE_URL}${userInfoState?.user?.avatarKey}`}}
            style={{width: 60, height: 60, borderRadius: 50}}
          />
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '400',
                marginLeft: 10,
                color: 'black',
              }}>
              {userInfoState?.user?.displayName &&
                userInfoState?.user?.displayName}{' '}
              {userInfoState?.user?.lastName && userInfoState?.user?.lastName}
            </Text>
            <Text style={{marginLeft: 10, color: 'black'}}>
              {userInfoState?.user?.email && userInfoState?.user?.email}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 0.65,
          borderTopColor: 'gray',
          borderTopWidth: 0.5,
          paddingTop: 10,
        }}>
        {/* {data?.map((item,index)=>{
            return <OrgCard key={index} item={item}/>
          })} */}
        <FlatList
          data={data}
          renderItem={({item}) => (
            <OrgCard item={item} navigation={navigation} />
          )}
        />
      </View>
      <View
        style={{
          flex: 0.2,
          borderTopColor: 'gray',
          borderTopWidth: 0.3,
          justifyContent: 'center',
        }}>
        <Button
          title="Sign Out"
          onPress={() => {
            signOutAction();
          }}
        />
      </View>
    </View>
  );
};
const mapStateToProps = state => ({
  orgsState: state.orgsReducer,
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    getChannelsAction: (token, orgId, userId) =>
      dispatch(getChannelsStart(token, orgId, userId)),
    switchOrgAction: (accessToken, orgId, userId) =>
      dispatch(switchOrgStart(accessToken, orgId, userId)),
    signOutAction: () => dispatch(signOut()),
    removeCountOnOrgCardAction:(orgId)=>
      dispatch(removeCountOnOrgCard(orgId)),
    moveChannelToTopAction :(teamIdArr)=> dispatch(moveChannelToTop(teamIdArr)) 
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomeDrawerScreen);
