import {StyleSheet} from 'react-native';
export const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.primaryColor,
    },
    content: {
      padding: 20,
      flex: 1,
    },
    text: {
      fontSize: 16,
      color: colors?.textColor,
      marginBottom: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: '500',
      color: colors?.textColor,
      marginBottom: 10,
      marginTop: 10,
    },
    buttonBorder: {
      borderWidth: 1,
      padding: 5,
      borderRadius: 5,
    },
    memberContainer: {
      flexDirection: 'row',
      minHeight: 30,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom: 10,
      justifyContent: 'space-between',
    },
    userToAddContainer: {
      flexDirection: 'row',
      //   minHeight: 30,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginTop: 5,
      justifyContent: 'space-between',
    },
    memberText: {
      fontSize: 16,
      color: colors?.textColor,
    },
  });
