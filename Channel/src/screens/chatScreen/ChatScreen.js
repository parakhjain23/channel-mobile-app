import React from 'react';
import {Text, TextInput, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatScreen = () => {
  const [value, onChangeText] = React.useState('Useless Multiline Placeholder');
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 7}}>
        <Text>hello</Text>
      </View>
      <View style={{flex: 1, margin: 10, flexDirection: 'row'}}>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          onChangeText={text => onChangeText(text)}
          value={value}
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: 'grey',
            flex: 1,
          }}
        />
        <View style={{justifyContent:'center',margin:10}}>
          <MaterialIcons name="send" size={20}/>
        </View>
      </View>
    </View>
  );
};
export default ChatScreen;
