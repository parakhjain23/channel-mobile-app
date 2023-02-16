import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import { setActiveChannelTeamId } from '../../redux/actions/channels/SetActiveChannelId';

const ExploreChannels = props => {
  const [channels, setChannels] = useState([]);
  const navigation = useNavigation();
  async function fetchAllChannels() {
    const response = await fetch(
      `https://api.intospace.io/chat//team?$paginate=false&orgId=${props?.orgsState?.currentOrgId}&isArchived=false&includeUsers=false&$limit=50`,
      {
        method: 'GET',
        headers: {
          Authorization: props?.userInfoState?.accessToken,
        },
      },
    );
    const result = await response.json();
    setChannels(result);
  }
  useEffect(() => {
    fetchAllChannels();
  }, []);
  const RenderChannels = ({item, navigation, props}) => {
    console.log('render', item);
    return (
      <TouchableOpacity
        style={{
          borderWidth: 0.5,
          borderColor: 'gray',
          borderRadius: 5,
          height: 60,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        onPress={() => {
          props?.setActiveChannelTeamIdAction(item?._id);
          navigation.navigate('Chat', {
            chatHeaderTitle: item?.name,
            teamId: item?._id,
          });
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 13,
          }}>
          <Text style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
            # {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {channels?.length == 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={channels || []}
          renderItem={({item}) => {
            return (
              <RenderChannels
                item={item}
                navigation={navigation}
                props={props}
              />
            );
          }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        />
      )}
    </View>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgsState: state.orgsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    setActiveChannelTeamIdAction: teamId =>
      dispatch(setActiveChannelTeamId(teamId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ExploreChannels);
