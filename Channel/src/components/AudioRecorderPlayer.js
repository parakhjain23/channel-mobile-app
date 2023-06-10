import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Slider from '@react-native-community/slider';

const AudioRecordingPlayer = ({remoteUrl}) => {
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  useEffect(() => {
    return () => {
      onStopPlay();
    };
  }, []);

  const onStartPlay = async () => {
    try {
      const msg = await audioRecorderPlayer.startPlayer(`${remoteUrl}`);
      setIsPlaying(true);
      audioRecorderPlayer.addPlayBackListener(({currentPosition, duration}) => {
        setCurrentPositionSec(currentPosition);
        setCurrentDurationSec(duration);
      });
    } catch (error) {
      console.error('Failed to start playing:', error);
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to stop playing:', error);
    }
  };

  const handleSeek = value => {
    audioRecorderPlayer.seekToPlayer(value);
  };

  const renderPlayButton = () => {
    if (isPlaying) {
      return (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.buttons, {marginRight: 10}]}
            onPress={onStopPlay}>
            <Icon name="stop-circle" size={28} color={'black'} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.buttons, {marginRight: 10}]}
            onPress={onStartPlay}>
            <Icon name="play-circle" size={28} color={'black'} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const formatTime = milliseconds => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
  };

  const padZero = number => {
    return number.toString().padStart(2, '0');
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        {renderPlayButton()}
        <Slider
          style={styles.sliderContainer}
          value={currentPositionSec}
          minimumValue={0}
          maximumValue={currentDurationSec}
          onSlidingComplete={handleSeek}
          thumbTintColor="#000"
          minimumTrackTintColor="#000"
          maximumTrackTintColor="#888"
          disabled={!isPlaying}
        />
        {isPlaying && (
          <Text style={styles.timeText}>
            {formatTime(currentPositionSec)} / {formatTime(currentDurationSec)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 0.7,
    borderColor: 'gray',
    borderRadius: 10,
    flex: 1,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sliderContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 0,
    marginRight: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttons: {
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 8,
  },
});

export default AudioRecordingPlayer;
