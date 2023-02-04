import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {
  getChatsStart,
  sendMessageStart,
} from '../../redux/actions/chat/ChatActions';
import { deleteMessageStart } from '../../redux/actions/chat/DeleteChatAction';

const RenderChatCard = ({chat, userInfoState, orgState ,deleteMessageAction}) => {
  const [optionsVisible, setOptionsVisible] = useState(false);

  const onLongPress = () => {
    setOptionsVisible(true);
  };

  const date = new Date(chat.updatedAt);
  const FlexAlign =
    chat?.senderId == userInfoState?.user?.id ? 'flex-end' : 'flex-start';
  const SenderName =
    chat?.senderId == userInfoState?.user?.id
      ? 'You'
      : orgState?.userIdAndNameMapping[chat?.senderId];
  return (
    <TouchableOpacity onLongPress={onLongPress}>
      {optionsVisible && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={()=>{setOptionsVisible(false),deleteMessageAction(userInfoState?.accessToken,chat?._id)}}>
            <Text style={styles.option}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.messageContainer}>
        <View style={[styles.senderName, { alignSelf: FlexAlign }]}>
          <Text>{SenderName}</Text>
        </View>
        <View
          style={[
            styles.message,
            {
              alignSelf: FlexAlign,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 10,
              padding: 8,
            },
          ]}>
          <Text>{chat?.content}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>
              {date.getHours() + ':' + date.getMinutes()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    // <TouchableOpacity>
    //   <View style={{margin: 10}}>
    //   <View style={{alignSelf: FlexAlign}}>
    //     <Text>{SenderName}</Text>
    //   </View>
    //   <View
    //     style={{
    //       width: '70%',
    //       flexDirection: 'row',
    //       alignSelf: FlexAlign,
    //       justifyContent:'space-between',
    //       borderWidth: 1,
    //       borderColor: 'gray',
    //       borderRadius: 10,
    //       padding: 8,
    //       flexWrap:'wrap'
    //     }}>
    //     <Text>{(chat?.content)}</Text>
    //     <View style={{justifyContent:'flex-end'}}><Text style={{fontSize:10}}>{date.getHours() +':'+ date.getMinutes()} </Text></View>
    //   </View>
    // </View>
    // </TouchableOpacity>
  );
};
const ChatScreen = ({
  route,
  userInfoState,
  fetchChatsOfTeamAction,
  sendMessageAction,
  chatState,
  orgState,
  deleteMessageAction
}) => {
  const {teamId} = route.params;
  const [message, onChangeMessage] = React.useState(null);
  useEffect(() => {
    if(chatState?.data[teamId]?.messages == undefined || chatState?.data[teamId]?.messages == [] || !chatState?.data[teamId]?.apiCalled){
      fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
    }
  }, []);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 7}}>
        {/* {chatState?.data[teamId]?.isloading ? (
          <ActivityIndicator />
        ) : ( */}
          <FlatList
            data={chatState?.data[teamId]?.messages || []}
            renderItem={({item}) => (
              <RenderChatCard
                chat={item}
                userInfoState={userInfoState}
                orgState={orgState}
                deleteMessageAction={deleteMessageAction}
              />
            )}
            inverted
            // contentContainerStyle={{ flexDirection: 'column-reverse' }}
          />
        {/* )} */}
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
                (message).trim(),
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
    deleteMessageAction: (accessToken,msgId) =>dispatch(deleteMessageStart(accessToken,msgId))  
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
const styles = StyleSheet.create({
  messageContainer: {
    margin: 10,
  },
  senderName: {
    alignSelf: 'flex-start',
  },
  message: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  timeContainer: {
    justifyContent: 'flex-end',
  },
  time: {
    fontSize: 10,
  },
  optionsContainer: {
    // position: 'relative',
    flex:1,
    flexDirection:'row',
    padding: 8,
    borderRadius: 10,
    width:100,
    backgroundColor:'red',
    alignSelf:'flex-end'
  },
  option: {
    margin: 8,
    backgroundColor:'yellow'
  }})