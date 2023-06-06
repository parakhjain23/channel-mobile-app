import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import {useEffect, useState} from 'react';
import {Dimensions, Keyboard} from 'react-native';

const useKeyboard = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    Dimensions.get('window').height,
  );
  const keyboardShow =
    Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  const keyboardHide =
    Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(keyboardShow, e => {
      setKeyboardVisible(true);
      const keyboardHeight = e.endCoordinates.height;
      const newViewportHeight =
        Dimensions.get('window').height - keyboardHeight;
      setViewportHeight(newViewportHeight);
    });

    const keyboardHideListener = Keyboard.addListener(keyboardHide, () => {
      setKeyboardVisible(false);
      setViewportHeight(Dimensions.get('window').height);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return {isKeyboardVisible, viewportHeight};
};
const ScrollDownButton = ({scrollToBottom, isVisible, isNewMessage}) => {
  const {isKeyboardVisible, viewportHeight} = useKeyboard();
  const translateY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(translateY.value, {
            damping: 14,
          }),
        },
      ],
    };
  });

  const derivedValue = useDerivedValue(() => {
    return (translateY.value =
      Platform.OS == 'ios'
        ? isVisible && isKeyboardVisible
          ? -viewportHeight * 0.03
          : isVisible
          ? -viewportHeight * 0.02
          : viewportHeight * 0.9
        : isVisible && isKeyboardVisible
        ? -viewportHeight * 0.03
        : isVisible
        ? -viewportHeight * 0.02
        : viewportHeight * 0.9);
  });

  translateY.value = derivedValue.value;

  return (
    <Animated.View style={[styles.scrollToBottom, animatedStyles]}>
      {isNewMessage && (
        <View style={styles.redDot}>
          <Text style={styles.exclamation}>!</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          scrollToBottom();
        }}
        style={styles.touchableArrow}>
        <FontAwesome name="angle-double-down" size={20} color={'#000000'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollToBottom: {
    height: 40,
    width: 40,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    position: 'absolute',
    bottom: 0,
    right: 0,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 2,
          height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  redDot: {
    height: 12,
    width: 12,
    borderRadius: 50,
    backgroundColor: 'red',
    position: 'absolute',
    right: 3,
    top: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exclamation: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  touchableArrow: {
    padding: 10,
  },
});

export default ScrollDownButton;
