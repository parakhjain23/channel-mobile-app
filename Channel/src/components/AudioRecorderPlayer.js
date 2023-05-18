// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Dimensions,
//   Animated,
//   PermissionsAndroid,
// } from 'react-native';
// // import { BarIndicator } from 'react-native-indicators';
// // import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome';

// import AudioRecorderPlayer ,{
//   AVEncoderAudioQualityIOSType,
//   AVEncodingOption,
//   AudioEncoderAndroidType,
//   AudioSourceAndroidType,
//   OutputFormatAndroidType,
// } from 'react-native-audio-recorder-player';
// // import ReactNativeBlobUtil from 'react-native-blob-util';
// import RNFS from 'react-native-fs'
// import { ActivityIndicator } from 'react-native-paper';

// const { height, width } = Dimensions.get('window');
// const audioRecorderPlayer = new AudioRecorderPlayer();
// const dirs = RNFS.CachesDirectoryPath

// const AudioRecordComponent = ({}) => {
//   const [isRecording, setIsRecording] = useState(false)
//   const [recordSecs, setRecordSecs] = useState(0);
//   const [recordTime, setRecordTime] = useState('00:00:00');
//   const [currentPositionSec, setCurrentPositionSec] = useState(0);
//   const [currentDurationSec, setCurrentDurationSec] = useState(0);
//   const [playTime, setPlayTime] = useState('00:00:00');
//   const [duration, setDuration] = useState('00:00:00');
//   const [isRecorded, setIsRecorded] = useState(false);
//   const [initialScale] = useState(1);
//   const [finalScale] = useState(1.5);
//   const [isRecordingProgress, setIsRecordingProgress] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const scaleValueRef = useRef(null);
//   const scaleValue = useRef(new Animated.Value(initialScale)).current;

//   useEffect(() => {
//     audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5

//     return () => {
//       onStopRecord();
//       setIsRecording(false);
//       setIsRecorded(true);
//       setIsRecordingProgress(false);
//       onStopPlay();
//     };
//   }, []);

//   const onStartRecord = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         ]);

//         console.log('write external storage', grants);

//         if (
//           grants['android.permission.RECORD_AUDIO'] ===
//             PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.log('permissions granted');
//         } else {
//           console.log('All required permissions not granted');
//           return;
//         }
//       } catch (err) {
//         console.warn(err);
//         return;
//       }
//     }

//     const audioSet = {
//       AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
//       AudioSourceAndroid: AudioSourceAndroidType.MIC,
//       AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
//       AVNumberOfChannelsKeyIOS: 2,
//       AVFormatIDKeyIOS: AVEncodingOption.aac,
//       OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
//     };

//     console.log('audioSet', audioSet);
//     setIsRecordingProgress(true);

//     const uri = await audioRecorderPlayer.startRecorder(
//       getPath(),
//       audioSet,
//     );

//     audioRecorderPlayer.addRecordBackListener((e) => {
//       setRecordSecs(e.currentPosition);
//       setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//       setDuration(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//     });

//     console.log(`uri: ${uri}`);
//   };

//   const getPath = () => {
//     if (Platform.OS === 'ios') {
//       return `sound.m4a`;
//     } else if (Platform.OS === 'android') {
//       return `${dirs}/sound.mp3`;
//     }
//   };

//   const onStopRecord = async () => {
//     const result = await audioRecorderPlayer.stopRecorder();
//     audioRecorderPlayer.removeRecordBackListener();
//     setRecordSecs(0);
//     console.log(result);
//   };

//   const onStartPlay = async () => {
//     console.log('onStartPlay', getPath());

//     try {
//       const msg = await audioRecorderPlayer.startPlayer(getPath());
//       const volume = await audioRecorderPlayer.setVolume(1.0);
//       console.log(`path: ${msg}`, `volume: ${volume}`);

//       audioRecorderPlayer.addPlayBackListener((e) => {
//         setCurrentPositionSec(e.currentPosition);
//         setCurrentDurationSec(e.duration);
//         setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//         setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

//         if (e.currentPosition === e.duration) {
//           setIsPlaying(false);
//         }
//       });
//     } catch (err) {
//       console.log('startPlayer error', err);
//     }
//   };

//   const onStopPlay = async () => {
//     console.log('onStopPlay');
//     audioRecorderPlayer.stopPlayer();
//     audioRecorderPlayer.removePlayBackListener();
//   };

//   const handleRecordButtonPress = () => {
//     if (isRecordingProgress) {
//       onStopRecord();
//       setIsRecorded(true);
//       setIsRecordingProgress(false);
//     } else {
//       onStartRecord();
//     }
//   };

//   const renderTimer = () => {
//     if (isRecorded) {
//       return (
//         <Text style={{color:'black'}}>
//           {playTime} / {duration}
//         </Text>
//       );
//     } else {
//       return <Text style={{color:'black'}}>{recordTime}</Text>;
//     }
//   };

//   const handlePlayButtonPress = () => {
//     if (isPlaying) {
//       onStopPlay();
//       setIsPlaying(false);
//     } else {
//       setIsPlaying(true);
//       onStartPlay();
//     }
//   };

//   return (
//     <View style={styles.AudioContainer}>
//      {isRecording &&  <View style={styles.innerContainer}>
//         <TouchableOpacity
//           style={styles.buttons}
//           onPress={() => {
//             setIsRecording(false);
//             onStopRecord();
//             onStopPlay();
//             setIsRecorded(false);
//           }}>
//           {/* <Entypo name="cross" size={20} color={'#313131'} /> */}
//           <Icon name='times' size={20} color={'#313131'}/>
//         </TouchableOpacity>
//         <View style={styles.timerContainer}>
//           <View style={styles.animationContainer}>
//             {isRecorded ? null : (
//             //   <BarIndicator
//             //     color="#4d4d4d"
//             //     animating={isRecordingProgress}
//             //     hidesWhenStopped={false}
//             //     count={15}
//             //     size={16}
//             //   />
//             <ActivityIndicator size={'small'} color='white' animating={isRecordingProgress}/>
//             )}
//           </View>
//           {renderTimer()}
//         </View>
//         {isRecorded && (
//           <View style={styles.buttonsContainer}>
//             <TouchableOpacity
//               style={[styles.buttons, { marginRight: 10 }]}
//               onPress={handlePlayButtonPress}>
//               {isPlaying ? (
//                 // <Entypo name="controller-stop" size={20} color={'#808080'} />
//                 <Icon name="stop-circle" size={24} color={'black'} />

//               ) : (
//                 // <Entypo name="controller-play" size={20} color={'#808080'} />
//                 <Icon name="play-circle" size={24} color={'black'} />

//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>}
//       <TouchableOpacity style={{margin:20,backgroundColor:'blue',width:'50%',height:30,justifyContent:'center',flexDirection:'row'}} onPress={()=>setIsRecording(true)}>
//         <Text>
//           record
//         </Text>
//       </TouchableOpacity>
//       <View style={styles.buttonsContainer}>
//             <TouchableOpacity
//               style={[styles.buttons, { marginRight: 10 }]}
//               onPress={handleRecordButtonPress}>
//               {isRecordingProgress ? (
//                 // <Entypo name="controller-stop" size={20} color={'#808080'} />
//                 <Icon name="microphone-slash" size={24} color={'black'} />

//               ) : (
//                 // <Entypo name="controller-record" size={20} color={'red'} />
//                 <Icon name="microphone" size={24} color={'black'} />

//               )}
//             </TouchableOpacity>
//           </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   AudioContainer: {
//     backgroundColor: '#efefef',
//     alignItems: 'center',
//     width: width,
//     paddingVertical: 20,
//   },
//   innerContainer: {
//     backgroundColor: '#c6dbf7',
//     padding: 5,
//     borderRadius: 50,
//     width: '90%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   buttons: {
//     backgroundColor: '#fff',
//     borderRadius: 50,
//     padding: 8,
//   },
//   timerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '60%',
//     justifyContent: 'space-evenly',
//   },
//   animationContainer: {},
//   buttonsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default AudioRecordComponent;

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Slider from '@react-native-community/slider';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecordingPlayer = ({
  remoteUrl
}) => {
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
      const msg = await audioRecorderPlayer.startPlayer(
        `${remoteUrl}`,
      );
      setIsPlaying(true);
      audioRecorderPlayer.addPlayBackListener(({ currentPosition, duration }) => {
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
            style={[styles.buttons, { marginRight: 10 }]}
            onPress={onStopPlay}
          >
            <Icon name="stop-circle" size={28} color={'black'} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.buttons, { marginRight: 10 }]}
            onPress={onStartPlay}
          >
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
        <Text style={styles.timeText}>
          {formatTime(currentPositionSec)} / {formatTime(currentDurationSec)}
        </Text>
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
    // marginTop: 400,
    // height: 60,
    // marginHorizontal: 20,
    borderRadius: 10,
    flex:1
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
    marginRight:5
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
