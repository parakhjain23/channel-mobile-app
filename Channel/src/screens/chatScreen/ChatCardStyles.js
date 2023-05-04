import {StyleSheet} from 'react-native';
import {s, vs, ms, mvs} from 'react-native-size-matters';

export const makeStyles = colors =>
  StyleSheet.create({
    text: {
      color: colors.textColor,
    },
    optionsText: {
      fontSize: ms(16),
      color: 'black',
    },
    inputWithReply: {
      padding: ms(10),
    },
    inputWithoutReply: {
      padding: ms(20),
      alignItems: 'center',
      borderWidth: ms(1),
      borderRadius: ms(10),
      borderColor: 'grey',
    },
    inputWithReplyContainer: {
      borderWidth: ms(1),
      borderColor: 'gray',
      borderRadius: ms(10),
    },
    replyMessageInInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: ms(5),
      borderWidth: ms(0.25),
      borderRadius: ms(5),
      padding: ms(5),
      backgroundColor: '#d9d9d9',
    },
    repliedContainer: {
      padding: ms(5),
      // backgroundColor:'#E5E4E2',
      backgroundColor: '#F5F5F5',
      borderRadius: ms(2),
      marginBottom: mvs(4),
      borderWidth: s(0.3),
    },
    option: {
      margin: ms(8),
      backgroundColor: 'yellow',
    },
    actionText: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: mvs(10),
    },
    container: {
      // borderWidth: ms(1),
      borderRadius: ms(5),
      flexDirection: 'row',
      alignItems: 'flex-end',
      // marginBottom: mvs(3),
      // maxWidth: '90%',
    },
    sentByMe: {
      alignSelf: 'flex-end',
      marginRight: ms(10),
      borderColor: 'transparent',
    },
    received: {
      alignSelf: 'flex-start',
      marginLeft: 0,
      borderColor: 'gray',
    },
    avatar: {
      width: ms(32),
      height: mvs(32),
      borderRadius: ms(16),
      marginHorizontal: ms(4),
    },
    textContainer: {
      padding: ms(8),
      // borderRadius: ms(8),
      flexDirection: 'column',
      maxWidth: '90%',
    },
    nameText: {
      fontWeight: 'bold',
      fontSize: ms(14),
      marginBottom: mvs(3),
    },
    messageText: {
      fontSize: ms(14),
    },
    timeText: {
      fontSize: ms(9),
      marginLeft: ms(5),
      marginRight: ms(-3),
      marginBottom: ms(-4),
    },
  });
