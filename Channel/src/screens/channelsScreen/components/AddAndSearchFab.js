import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddFabbuttonComponent = ({onOpen}) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 80,
        right: 10,
        alignSelf: 'center',
      }}>
      <FAB
        onPress={onOpen}
        color={'white'}
        animated={false}
        uppercase={false}
        icon={() => <Icon name="add" size={22} color={'white'} />}
        style={{
          backgroundColor: '#333333', // change the background color to light grey
          borderRadius: 50,
          alignSelf: 'center',
          padding: 2,
        }}
        labelStyle={{
          fontSize: 12,
          textAlign: 'center',
          lineHeight: 14,
        }}
      />
    </View>
  );
};

const SearchFabButtonComponent = ({setIsScrolling, textInputRef}) => {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#333333',
        borderRadius: 50,
        padding: 15,
      }}
      onPress={() => {
        setIsScrolling(true);
        setTimeout(() => {
          textInputRef?.current?.focus();
        }, 50);
      }}>
      <Icon name="search" size={28} color={'white'} />
    </TouchableOpacity>
  );
};
export const AddFabButton = React.memo(AddFabbuttonComponent);
export const SearchFabButton = React.memo(SearchFabButtonComponent);
