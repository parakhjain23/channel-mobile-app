import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, Text, TextInput, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {
  getChatsStart,
  sendMessageStart,
} from '../../redux/actions/chat/ChatActions';

const RenderChatCard = ({chat, userInfoState, orgState}) => {
  const FlexAlign =
    chat?.senderId == userInfoState?.user?.id ? 'flex-end' : 'flex-start';
  const SenderName =
    chat?.senderId == userInfoState?.user?.id
      ? 'You'
      : orgState?.userIdAndNameMapping[chat?.senderId];
  return (
    <View style={{margin: 10}}>
      <View style={{alignSelf: FlexAlign}}>
        <Text>{SenderName}</Text>
      </View>
      <View
        style={{
          width: '70%',
          flexDirection: 'row',
          alignSelf: FlexAlign,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
          padding: 8,
        }}>
        <Text>{(chat?.content)}</Text>
        <Text></Text>
      </View>
    </View>
  );
};
const ChatScreen = ({
  route,
  userInfoState,
  fetchChatsOfTeamAction,
  sendMessageAction,
  chatState,
  orgState,
}) => {
  const {teamId} = route.params;
  const [message, onChangeMessage] = React.useState(null);
  useEffect(() => {
    fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
  }, []);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 7}}>
        {chatState?.data[teamId]?.isloading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={chatState?.data[teamId]?.messages}
            renderItem={({item}) => (
              <RenderChatCard
                chat={item}
                userInfoState={userInfoState}
                orgState={orgState}
              />
            )}
            inverted
            // contentContainerStyle={{ flexDirection: 'column-reverse' }}
          />
        )}
      </View>
      <View style={{flex: 1, margin: 10, flexDirection: 'row'}}>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          onChangeText={text => onChangeMessage(text)}
          value={message}
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: 'grey',
            flex: 1,
          }}
          onSubmitEditing={() => onChangeMessage('')}
        />
        <View style={{justifyContent: 'center', margin: 10}}>
          <MaterialIcons
            name="send"
            size={20}
            onPress={() => {
              sendMessageAction(
                message,
                teamId,
                orgState?.currentOrgId,
                userInfoState?.user?.id,
                userInfoState?.accessToken
              );
              onChangeMessage('');
            }}
          />
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgState: state.orgsReducer,
  chatState: state.chatReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    fetchChatsOfTeamAction: (teamId, token) =>
      dispatch(getChatsStart(teamId, token)),
    sendMessageAction: (message, teamId, orgId, senderId,token) =>
      dispatch(sendMessageStart(message, teamId, orgId, senderId,token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
