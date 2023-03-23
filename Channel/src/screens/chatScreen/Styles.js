import { StyleSheet } from "react-native";

export const makeStyles = colors => StyleSheet.create({
    mainContainer: {flex: 1, backgroundColor: colors.primaryColor},
    text: {
      color: colors.textColor
    },
    repliedText:{
      color: 'black',
    },
    inputWithReply: {
      flex: 1,
      padding: 10,
    },
    inputWithoutReply: {
      flex: 1,
      // minHeight: 40,
      // paddingHorizontal: 10,
      // borderWidth: 1,
      // borderRadius: 10,
      // borderColor: 'grey',
      paddingVertical: 8,
    },
    inputWithReplyContainer: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
    },
    replyMessageInInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderWidth: 0.25,
      borderRadius: 5,
      padding: 5,
      backgroundColor: '#d9d9d9',
    },
    repliedContainer: {
      padding: 5,
      backgroundColor: '#d9d9d9',
      borderRadius: 5,
      marginBottom: 4,
    },
    option: {
      margin: 8,
      backgroundColor: 'yellow',
    },
    actionText: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    moveToBottom: {
      position: 'absolute',
      bottom: 10,
      right: 15,
      backgroundColor: '#cccccc',
      padding: 15,
      borderRadius: 25,
      color: 'black',
      fontSize: 19,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.46,
      shadowRadius: 11.14,
  
      elevation: 17,
    },
    container: {
      // borderWidth: 1,
      // borderColor: 'gray',
      // borderRadius: 10,
      // flexDirection: 'row',
      // alignItems: 'flex-end',
      // marginBottom: 15,
      // maxWidth: '90%',
    },
    sentByMe: {
      alignSelf: 'flex-end',
      marginRight: 10,
    },
    received: {
      alignSelf: 'flex-start',
      marginLeft: 10,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginHorizontal: 4,
    },
    textContainer: {
      padding: 8,
      borderRadius: 8,
      flexDirection: 'column',
      maxWidth: '70%',
    },
    nameText: {
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 4,
    },
    messageText: {
      fontSize: 14,
    },
    timeText: {
      fontSize: 10,
      color: '#666',
      marginRight: 3,
      marginBottom: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 4,
      borderColor: '#b3b3b3',
      paddingHorizontal: 5,
      paddingVertical: 4,
    },
    attachIcon: {
      marginRight: 8,
      color: 'black',
      backgroundColor: '#cccccc',
      padding: 8,
      borderRadius: 25,
    },
    optionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
  });