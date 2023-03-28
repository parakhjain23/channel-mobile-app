import React from 'react';
import {SearchBar} from '@rneui/themed';
import {TextInput} from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

const SearchBox = ({searchValue, changeText, isSearchFocus, hits}) => {
  const {colors} = useTheme();
  return (
    <TextInput
      value={searchValue}
      onChangeText={changeText}
      label='Search Channels'
      style={{backgroundColor: colors?.searchBoxBackgroundColor, borderWidth: 1, borderColor: colors?.color,marginHorizontal:1}}
      underlineStyle={{backgroundColor:'transparent'}}
      underlineColorAndroid="transparent"
      clearButtonMode="always"
      placeholder="Eg: Walkover"
      left={<TextInput.Icon icon="magnify" style={{justifyContent:'center'}}/>}
    />
    // <SearchBar
    //   autoFocus={isSearchFocus}
    //   lightTheme={false}
    //   leftIconContainerStyle={{}}
    //   containerStyle={{
    //     backgroundColor: 'white',
    //     borderColor: 'black',
    //     paddingTop: 5,
    //     marginHorizontal: 5,
    //     borderRadius: 10,
    //     borderWidth: 1,
    //     borderColor: 'black',
    //   }}
    //   inputContainerStyle={{
    //     backgroundColor: 'white',
    //     paddingLeft: 1,
    //   }}
    //   placeholder="Search Channels"
    //   onChangeText={changeText}
    //   style={{
    //     color: 'black',
    //     margin: 0,
    //   }}
    //   value={searchValue}
    // />
  );
};

export default SearchBox;
