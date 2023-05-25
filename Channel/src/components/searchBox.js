import React from 'react';
// import {SearchBar} from '@rneui/themed';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';

const SearchBox = ({searchValue, changeText, textInputRef}) => {
  const {colors} = useTheme();
  return (
    <TextInput
      ref={textInputRef}
      value={searchValue}
      onChangeText={changeText}
      style={{
        backgroundColor: colors?.searchBoxBackgroundColor,
        borderWidth: 1,
        borderColor: 'black',
        marginHorizontal: 1,
      }}
      textColor={colors?.textColor}
      underlineStyle={{backgroundColor: 'transparent'}}
      underlineColorAndroid="transparent"
      // clearButtonMode="always"
      placeholder="Search"
      placeholderTextColor={colors?.textColor}
      left={
        <TextInput.Icon
          icon="magnify"
          style={{justifyContent: 'center'}}
          iconColor={colors?.textColor}
        />
      }
      right={
        searchValue != '' && (
          <TextInput.Icon
            icon="close"
            style={{justifyContent: 'center'}}
            onPressIn={() => {
              changeText('');
            }}
            iconColor={colors?.textColor}
          />
        )
      }
    />
  );
};

export default SearchBox;
