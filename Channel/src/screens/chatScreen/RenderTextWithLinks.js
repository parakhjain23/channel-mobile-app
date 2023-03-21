import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Linking} from 'react-native';
import RenderHTML from 'react-native-render-html';
import * as RootNavigation from '../../navigation/RootNavigation';
import { fetchSearchedUserProfileStart } from '../../redux/actions/user/searchUserProfileActions';
import {store} from '../../redux/Store'
export const renderTextWithLinks = (text, mentionsArr = [], accessToken,orgState,width) => {
  const urlRegex =
    /((?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+(?:#[\w\-])?(?:\?[^\s])?)/gi;
  if (mentionsArr?.length > 0) {
    const regex = /\(MENTION-([^)]+)\)/g;
    const regexUser = /@(\w+)/g;
    let mentionIdsArray = text.match(regex);
    let cleanedHtml = text.replace(regexUser, `<a href=$1>@$1</a>`);
    cleanedHtml = cleanedHtml.replace(regex, '');
    const source = {
      html: `${cleanedHtml}`,
    };
    const tagsStyles = {
      body:{
        color:'black',
      },
      a: {
        color: 'blue', // Set the link color
        textDecorationLine: 'underline', // Add an underline to the link
      },
    };
    const renderersProps = {
      a: {
        onPress: (evt, href) => {
          if (href.startsWith('about:///')) {
            const Name = href.substring('about:///'.length);
            for (let i = 0; i < mentionsArr?.length; i++) {
              if (
                orgState?.userIdAndDisplayNameMapping[mentionsArr[i]] === Name
              ) {
                RootNavigation.navigate('UserProfiles', {displayName: Name});
                store.dispatch(fetchSearchedUserProfileStart(mentionsArr[i], accessToken));
                break;
              }
            }
            // for(let i=0; i<mentionIdsArray?.length; i++){
            //   const cleanedMention = mentionIdsArray[i].replace("MENTION-", '').replace(/[()=]/g, '');
            //   const userId = base64.decode(cleanedMention)

            // if(orgState?.userIdAndDisplayNameMapping[userId]==Name){
            //   console.log(orgState?.userIdAndDisplayNameMapping[userId],'=-=-=-=');
            //   searchUserProfileAction(userId,userInfoState?.accessToken)
            //   RootNavigation.navigate('UserProfiles', {displayName:Name});
            // }
            // }
          }
        },
      },
    };
    return (
      <RenderHTML
        contentWidth={width}
        source={source}
        tagsStyles={tagsStyles}
        renderersProps={renderersProps}
      />
    );
  }
  const parts = text?.split(urlRegex);
  return parts?.map((part, i) =>
    urlRegex.test(part) ? (
      <TouchableOpacity
        key={i}
        onPress={() => {
          let url = part;
          if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
          }
          Linking.openURL(url);
        }}>
        <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
          {part}
        </Text>
      </TouchableOpacity>
    ) : (
      <Text key={i}>{part}</Text>
    ),
  );
};
