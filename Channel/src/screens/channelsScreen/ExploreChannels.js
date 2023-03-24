import {useNavigation, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import { setActiveChannelTeamId } from '../../redux/actions/channels/SetActiveChannelId';
import { s, vs, ms, mvs } from 'react-native-size-matters';
const ExploreChannels = props => {
  const {colors} = useTheme();
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
    return (
      <TouchableOpacity
        style={{
          borderWidth: ms(0.5),
          borderColor: 'gray',
          borderRadius: 5,
          height: s(60),
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor:colors?.primaryColor
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
            padding: s(13),
          }}>
          <Text style={{fontSize: ms(16,.5), fontWeight: '400', color: colors?.textColor}}>
            # {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{backgroundColor:colors?.primaryColor}}>
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
