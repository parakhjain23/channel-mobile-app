import React from "react";
import { SearchBar } from "@rneui/themed";

const SearchBox = ({ searchValue, changeText, isSearchFocus,hits }) => {
    
    return <SearchBar
        autoFocus={isSearchFocus}
        lightTheme={false}
        leftIconContainerStyle={{
            marginLeft: 5,
            marginRight: 1,
          }}
        containerStyle={{
            backgroundColor: 'white',
            borderColor: 'black',
            paddingTop: 5,
          }}
        inputContainerStyle={{
            backgroundColor: 'white',
            paddingLeft: 1,
          }}
        placeholder='Search Channels'
        onChangeText={changeText}
        style={{
            color: 'black',
            margin: 0,
          }}
        value={searchValue}
    />
}

export default (SearchBox)