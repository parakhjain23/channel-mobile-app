import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Linking} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../ChatCardStyles';
import {ms, s} from 'react-native-size-matters';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import ImageViewer from 'react-native-image-zoom-viewer';
import Clipboard from '@react-native-community/clipboard';
import HTMLView from 'react-native-htmlview';
import {RenderHTML} from 'react-native-render-html';
import * as RootNavigation from '../../../navigation/RootNavigation';
import {tagsStyles} from '../HtmlStyles';
import WebView from 'react-native-webview';
import {formatTime} from '../../../utils/FormatTime';
import AudioRecordingPlayer from '../../../components/AudioRecorderPlayer';

const ActionMessageCard = ({
  chat,
  userInfoState,
  orgState,
  chatState,
  searchUserProfileAction,
  index,
  setShowActions,
  setCurrentSelectedChatCard,
}) => {
  const {colors, dark} = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const swipeableRef = useRef(null);
  const {width} = useWindowDimensions();
  const sameSender =
    typeof chat?.sameSender === 'string'
      ? chat.sameSender === 'true'
      : chat?.sameSender;
  const isSameDate =
    typeof chat?.isSameDate === 'string'
      ? chat.isSameDate === 'true'
      : chat?.isSameDate;
  const isActivity =
    typeof chat.isActivity === 'string'
      ? chat.isActivity === 'true'
      : chat.isActivity;
  const attachment = useMemo(() => {
    if (typeof chat?.attachment === 'string') {
      return JSON.parse(chat?.attachment);
    } else {
      return chat?.attachment;
    }
  }, [chat?.attachment]);

  const handleImagePress = useCallback(
    index => {
      setSelectedImage(chat?.attachment?.[index]);
    },
    [chat?.attachment],
  );

  const handleModalClose = useCallback(() => {
    setSelectedImage(null);
  }, []);

  var parentId = chat?.parentId;
  const time = formatTime(chat?.createdAt);
  const sentByMe = chat?.senderId == userInfoState?.user?.id ? true : false;
  const containerBackgroundColor = useMemo(() => {
    if (sentByMe) {
      return colors.sentByMeCardColor;
    } else {
      return colors.receivedCardColor;
    }
  }, [colors, sentByMe]);
  const SenderName = useMemo(() => {
    if (chat?.senderId === userInfoState?.user?.id) {
      return 'You';
    } else if (orgState?.userIdAndDisplayNameMapping[chat?.senderId]) {
      return orgState?.userIdAndDisplayNameMapping[chat?.senderId];
    } else {
      return orgState?.userIdAndNameMapping[chat?.senderId];
    }
  }, [chat?.senderId, orgState, userInfoState]);
  const linkColor = sentByMe
    ? colors.sentByMeLinkColor
    : colors.recivedLinkColor;

  const textColor = sentByMe ? colors.sentByMeTextColor : colors?.textColor;

  const openLink = async url => {
    if (await InAppBrowser.isAvailable()) {
      const result = InAppBrowser?.open(url);
    } else {
      Linking.openURL(url);
    }
  };

  const htmlStyles = color => ({
    div: {
      color: color,
      fontSize: 16,
    },
  });
  function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.attribs?.class == 'mention') {
      return (
        <Text
          key={index}
          style={{
            color: chatState?.data[chat.teamId]?.parentMessages[parentId]
              ?.content
              ? 'black'
              : linkColor,
            textDecorationLine: 'underline',
            fontSize: 16,
          }}>
          @{node?.attribs?.['data-value']}
        </Text>
      );
    }
  }
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

  if (!isActivity) {
    return (
      <TouchableOpacity activeOpacity={0.6}>
        <View
          style={[
            styles.container,
            sentByMe ? styles.sentByMe : styles.received,
            {
              backgroundColor: containerBackgroundColor,
              marginTop: sameSender ? ms(0) : ms(10),
              marginBottom: index == 0 ? 10 : 3,
            },
          ]}>
          <View style={[styles.textContainer, {padding: 10}]}>
            {
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    styles.nameText,
                    {color: textColor, marginRight: 10, fontSize: 18},
                  ]}>
                  {SenderName}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    styles.text,
                    {
                      color: sentByMe ? '#cccccc' : dark ? '#cccccc' : 'black',
                      fontSize: 13,
                    },
                  ]}>
                  {time}
                </Text>
              </View>
            }
            {parentId != null && (
              <TouchableOpacity style={[styles.repliedContainer]}>
                {chatState?.data[chat.teamId]?.parentMessages[parentId]
                  ?.attachment?.length > 0 ? (
                  <Text style={{color: 'black'}}>
                    <Icon name="attach-file" size={ms(14)} /> attachment
                  </Text>
                ) : chatState?.data[chat.teamId]?.parentMessages[
                    parentId
                  ]?.content?.includes('<span class="mention"') ? (
                  <HTMLView
                    value={`<div>${
                      chatState?.data[chat.teamId]?.parentMessages[parentId]
                        ?.content
                    }</div>`}
                    renderNode={renderNode}
                    stylesheet={htmlStyles('black')}
                  />
                ) : (
                  <RenderHTML
                    source={{
                      html: chatState?.data[chat.teamId]?.parentMessages[
                        parentId
                      ]?.content?.replace(
                        emailRegex,
                        '<a href="mailTo:$&">$&</a>',
                      ),
                    }}
                    contentWidth={width}
                    tagsStyles={{body: {color: 'black'}}}
                  />
                )}
              </TouchableOpacity>
            )}
            <View style={{maxWidth: '80%'}}>
              <Modal
                visible={selectedImage !== null}
                transparent={true}
                onRequestClose={handleModalClose}>
                <ImageViewer
                  imageUrls={[
                    {
                      url: selectedImage?.resourceUrl,
                      freeHeight: true,
                      freeWidth: true,
                    },
                  ]}
                  enableSwipeDown={true}
                  onSwipeDown={handleModalClose}
                />
              </Modal>
            </View>
            {attachment?.length > 0 &&
              attachment?.map((item, index) => {
                return item?.contentType?.includes('image') ? (
                  <View
                    key={index}
                    style={{marginVertical: 5, alignItems: 'center'}}>
                    <Image
                      source={{uri: item?.resourceUrl}}
                      style={{
                        height: ms(150),
                        width: ms(150),
                      }}
                    />
                  </View>
                ) : item?.contentType?.includes('audio') ? (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      height: 50,
                      width: ms(280),
                    }}>
                    <AudioRecordingPlayer remoteUrl={item?.resourceUrl} />
                  </View>
                ) : (
                  <View
                    key={index}
                    style={[
                      styles.repliedContainer,
                      {
                        borderWidth: ms(0.5),
                        borderColor: 'gray',
                        borderRadius: ms(5),
                        padding: ms(10),
                      },
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      {item?.contentType?.includes('pdf') && (
                        <Image
                          source={require('../../../assests/images/attachments/pdfLogo.png')}
                          style={{
                            width: 40,
                            height: 40,
                            marginRight: 15,
                          }}
                        />
                      )}
                      {item?.contentType?.includes('doc') && (
                        <Image
                          source={require('../../../assests/images/attachments/docLogo.png')}
                          style={{
                            width: 40,
                            height: 40,
                            marginRight: 15,
                          }}
                        />
                      )}
                      <View>
                        <Text style={{color: 'black'}}>
                          {item?.title?.slice(0, 15) + '...'}
                        </Text>
                        <Text style={{color: 'black'}}>
                          {'...' + item?.contentType?.slice(-15)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {chat?.content?.includes('<span class="mention"') ? (
                <HTMLView
                  value={`<div>${chat?.content}</div>`}
                  renderNode={renderNode}
                  stylesheet={htmlStyles(textColor)}
                />
              ) : (
                <RenderHTML
                  source={{
                    html: chat?.content?.replace(
                      emailRegex,
                      '<a href="mailTo:$&">$&</a>',
                    ),
                  }}
                  contentWidth={width}
                  tagsStyles={tagsStyles(textColor, linkColor)}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}>
                {chat?.randomId != null && (
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      width: 20,
                    }}>
                    <Icon name="access-time" color={'white'} />
                  </View>
                )}
              </View>
            </View>
            {/* </View> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};
export const ActionMessageCardMemo = React.memo(ActionMessageCard);
