import { StyleSheet } from "react-native";

export const makeStyles = colors => StyleSheet.create({
    text: {
      color: colors.textColor,
    },
    inputWithReply: {
      padding: 10,
    },
    inputWithoutReply: {
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'grey',
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
    container: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 15,
      maxWidth: '90%',
    },
    sentByMe: {
      alignSelf: 'flex-end',
      marginRight: 10,
    },
    received: {
      alignSelf: 'flex-start',
      marginLeft: 0,
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
  });