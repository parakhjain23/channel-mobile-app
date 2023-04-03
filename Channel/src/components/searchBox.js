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
      style={{backgroundColor: colors?.searchBoxBackgroundColor, borderWidth: 1, borderColor: colors?.color,marginHorizontal:1}}
      underlineStyle={{backgroundColor:'transparent'}}
      underlineColorAndroid="transparent"
      clearButtonMode="always"
      placeholder="Search"
      left={<TextInput.Icon icon="magnify" style={{justifyContent:'center'}}/>}
    />
  );
};

export default SearchBox;
