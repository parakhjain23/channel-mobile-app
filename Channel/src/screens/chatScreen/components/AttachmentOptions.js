import {View, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Animated} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../Styles';
import {pickDocument} from '../DocumentPicker';
import {launchCameraForPhoto, launchGallery} from '../ImagePicker';

const AttachmentOptions = ({
  accessToken,
  setAttachment,
  setAttachmentLoading,
  showOptions,
  setShowOptions,
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const optionsPosition = useRef(new Animated.Value(0)).current;

  const showOptionsMethod = () => {
    setShowOptions(true);
    Animated.timing(optionsPosition, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const hideOptionsMethod = () => {
    Animated.timing(optionsPosition, {
      toValue: -200,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setShowOptions(false);
    }, 130);
  };
  return (
    <>
      {showOptions && (
        <View style={{justifyContent: 'center'}}>
          <Animated.View
            style={[
              styles.optionsContainer,
              {transform: [{translateX: optionsPosition}]},
            ]}>
            <View style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="attach-file"
                size={20}
                style={styles.attachIcon}
                onPress={() =>
                  pickDocument(setAttachment, accessToken, setAttachmentLoading)
                }
              />
              <MaterialIcons
                name="camera"
                size={20}
                style={styles.attachIcon}
                onPress={() => {
                  launchCameraForPhoto(
                    accessToken,
                    setAttachment,
                    setAttachmentLoading,
                  );
                }}
              />
              <MaterialIcons
                name="image"
                size={20}
                style={styles.attachIcon}
                onPress={() => {
                  launchGallery(
                    accessToken,
                    setAttachment,
                    setAttachmentLoading,
                  );
                }}
              />
              <MaterialIcons
                name="chevron-left"
                size={20}
                style={styles.attachIcon}
                onPress={hideOptionsMethod}
              />
            </View>
          </Animated.View>
        </View>
      )}
      <View style={{justifyContent: 'center'}}>
        {!showOptions && (
          <MaterialIcons
            name="add"
            size={20}
            style={styles.attachIcon}
            onPress={showOptionsMethod}
          />
        )}
      </View>
    </>
  );
};

export default AttachmentOptions;
