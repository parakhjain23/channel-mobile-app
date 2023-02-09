import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {
  getChatsStart,
  sendMessageStart,
} from '../../redux/actions/chat/ChatActions';
import {deleteMessageStart} from '../../redux/actions/chat/DeleteChatAction';

const AddRemoveJoinedMsg = ({senderName,content , orgState}) =>{
  const id = content.split(" ").pop().slice(2, -2);
  const name = orgState?.userIdAndNameMapping[id];
  const activityName = content.split(" ")[0];
  const textToShow = content == 'joined this channel' ? senderName +" "+ content : senderName +" "+ activityName +" "+ name
  return <View style={[styles.messageContainer,{flexDirection:'row',justifyContent:'center'}]}>
    <Text>{textToShow}</Text>
  </View>
}

const RenderChatCard = ({
  chat,
  userInfoState,
  orgState,
  deleteMessageAction,
  chatState,
  setreplyOnMessage,
  setrepliedMsgDetails
}) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const onLongPress = () => {
    setOptionsVisible(true);
  };
  const parentId = chat?.parentId
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
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(false),
                deleteMessageAction(userInfoState?.accessToken,chat?._id);
            }}>
            <Text style={styles.option}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(false)
              setrepliedMsgDetails(chat)
              setreplyOnMessage(true)
            }}>
            <Text style={styles.option}>reply</Text>
          </TouchableOpacity>
        </View>
      )}
      {!chat?.isActivity ? <View style={styles.messageContainer}>
        <View style={[styles.senderName, {alignSelf: FlexAlign}]}>
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
          {parentId != null && (
            <View>
              <Text>{chatState?.data[chat.teamId]?.parentMessages[parentId]?.content}</Text>
            </View>
          )}
          <Text>{chat?.content}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>
              {date.getHours() + ':' + date.getMinutes()}
            </Text>
          </View>
        </View>
      </View>
      : <AddRemoveJoinedMsg senderName={SenderName} content={chat?.content} orgState={orgState}/>
    }
    </TouchableOpacity>
  );
};
const ListFooterComponent = () => {
  const [animate,setAnimate] = useState(true);
  useEffect(()=>{
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  })
  return <ActivityIndicator animating={animate} size={'small'}/>
}
const ChatScreen = ({
  route,
  userInfoState,
  fetchChatsOfTeamAction,
  sendMessageAction,
  chatState,
  orgState,
  deleteMessageAction,
  channelsState
}) => {
  var {teamId,reciverUserId} = route.params;
  if(teamId == undefined){
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId]
  }
  console.log(teamId,"this is team id in chat screen");
  const [message, onChangeMessage] = React.useState(null);
  const [replyOnMessage, setreplyOnMessage] = useState(false)
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('')
  const skip = chatState?.data[teamId]?.messages.length!=undefined ? chatState?.data[teamId]?.messages.length : 0;

  useEffect(() => {
    if (
      chatState?.data[teamId]?.messages == undefined ||
      chatState?.data[teamId]?.messages == [] ||
      !chatState?.data[teamId]?.apiCalled
    ) {
      fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
    }
  }, []);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 7}}>
        {teamId == undefined ? (
          <ActivityIndicator />
        ) : (
        <FlatList
          data={chatState?.data[teamId]?.messages || []}
          renderItem={({item}) => (
            <RenderChatCard
              chat={item}
              userInfoState={userInfoState}
              orgState={orgState}
              deleteMessageAction={deleteMessageAction}
              chatState={chatState}
              setreplyOnMessage={setreplyOnMessage}
              setrepliedMsgDetails={setrepliedMsgDetails}
            />
          )}
          inverted
          ListFooterComponent={chatState?.data[teamId]?.messages?.length>15 && ListFooterComponent}
          onEndReached={()=>{fetchChatsOfTeamAction(teamId,userInfoState?.accessToken,skip)}}
          onEndReachedThreshold={0.2}
          // contentContainerStyle={{ flexDirection: 'column-reverse' }}
        />
        )} 
      </View>
      <View style={{flex: 1, margin: 10, justifyContent:'center'}}>
        {
          replyOnMessage && <TouchableOpacity onPress={()=>setreplyOnMessage(false)}>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:10,borderWidth:1,height:30}}>
            <Text>{repliedMsgDetails?.content}</Text>
          </View>
          </TouchableOpacity>
        }
        <View style={{flexDirection:'row'}}>
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
                message.trim(),
                teamId,
                orgState?.currentOrgId,
                userInfoState?.user?.id,
                userInfoState?.accessToken,
                repliedMsgDetails?._id || null
              );
              onChangeMessage('');
              setreplyOnMessage(false)
              setrepliedMsgDetails(null)
            }}
          />
        </View>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgState: state.orgsReducer,
  chatState: state.chatReducer,
  channelsState: state.channelsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    fetchChatsOfTeamAction: (teamId, token, skip) =>
      dispatch(getChatsStart(teamId, token, skip)),
    sendMessageAction: (message, teamId, orgId, senderId, token, parentId) =>
      dispatch(sendMessageStart(message, teamId, orgId, senderId, token, parentId)),
    deleteMessageAction: (accessToken, msgId) =>
      dispatch(deleteMessageStart(accessToken, msgId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
const styles = StyleSheet.create({
  messageContainer: {
    margin: 10,
  },
  repliedContainer: {
    margin: 5,
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
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    borderRadius: 10,
    width: 100,
    backgroundColor: 'red',
    alignSelf: 'flex-end',
  },
  option: {
    margin: 8,
    backgroundColor: 'yellow',
  },
});
