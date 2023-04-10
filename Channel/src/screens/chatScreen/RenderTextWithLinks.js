import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Linking} from 'react-native';
import * as RootNavigation from '../../navigation/RootNavigation';
import cheerio from 'cheerio';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useTheme } from 'react-native-paper';

export const RenderTextWithLinks = ({
  text,
  mentions,
  repliedContainer,
  orgState,
  searchUserProfileAction,
  userInfoState,
  colors,
  sentByMe
}) => {
  const {dark} = useTheme();
  const fontWeight = dark ? '700' : '900' 
  const linkColor = sentByMe ? colors.sentByMeLinkColor : colors.recivedLinkColor
  const urlRegex =
    /((?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+(?:#[\w\-])?(?:\?[^\s])?)/gi;
  function findKeyByValue(value) {
    const newValue = value?.substring(1);
    for (let key in orgState?.userIdAndDisplayNameMapping) {
      if (orgState?.userIdAndDisplayNameMapping[key] === newValue) {
        return key;
      }
    }
    return null;
  }
  function highlight(text, result, repliedContainer) {
    const textColor = repliedContainer ? 'black' : sentByMe ? colors.sentByMeTextColor : colors?.textColor;
    let A = orgState?.userIdAndDisplayNameMapping;
    text = text.replace(/@{1,2}(\w+)/g, (match, p1) => {
      return A[p1] ? `@${A[p1]}` : match;
    });
    const parts = text?.split(/(\B@\w+)/);
    return parts?.map((part, index) => {
      if (/^@\w+$/.test(part)) {
        let key1 = findKeyByValue(part);
        if (key1 != null) {
          return (
            <TouchableOpacity
              key={index}
              onPress={async () => {
                key1 != 'all' &&
                  (await searchUserProfileAction(
                    key1,
                    userInfoState?.accessToken,
                  )) &&
                  RootNavigation.navigate('UserProfiles', {
                    displayName: orgState?.userIdAndDisplayNameMapping[key1],
                  });
              }}>
              <Text
                style={{
                  color: repliedContainer ? textColor : linkColor,
                  fontWeight: fontWeight,
                  textDecorationLine: 'underline',
                }}>
                {part}
              </Text>
            </TouchableOpacity>
          );
        }
      }
      return (
        <Text key={index} style={{color: textColor}}>
          {part}
        </Text>
      );
    });
  }

  var result = [];
  var resultStr = '';
  const $ = cheerio.load(`<div>${text}</div>`);
  $('span[contenteditable="false"]').remove();
  $('*')
    .contents()
    .each((index, element) => {
      if (element.type === 'text') {
        const message = $(element).text().trim();
        if (message !== '') {
          resultStr += message + ' ';
          result.push(message);
          // console.warn(message);
        }
      } else if ($(element).is('span')) {
        resultStr +=
          $(element)?.attr('data-denotation-char') +
          $(element)?.attr('data-id') +
          ' ';
        // result?.push($(element)?.attr('data-denotation-char') +
        // $(element)?.attr('data-id'))
        var id = $(element)?.attr('data-id');
        var data = '@' + $(element)?.attr('data-value');
        result?.push({[id]: data});
      }
    });
  resultStr = resultStr.trim();

  const openLink = async url => {
    if (await InAppBrowser.isAvailable()) {
      InAppBrowser?.open(url);
    } else {
      Linking.openURL(url);
    }
  };
  const parts = resultStr?.split(urlRegex);

  return parts?.map((part, index) =>
    urlRegex.test(part) ? (
      <View key={index} style={{maxWidth: 250}}>
        <TouchableOpacity
          key={index}
          onPress={() => {
            let url = part;
            //regEx for checking if https included or not
            if (!/^https?:\/\//i.test(url)) {
              url = 'https://' + url;
            }

            openLink(url);
          }}>
          <Text
            style={{color: linkColor, textDecorationLine: 'underline',fontWeight:fontWeight}}>
            {part}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text key={index}>{highlight(part, result, repliedContainer)}</Text>
    ),
  );
};
