import {PermissionsAndroid, Platform} from 'react-native';
import AudioRecorderPlayer, { AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSourceAndroidType, OutputFormatAndroidType } from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

export const AudioRecorderPlay = new AudioRecorderPlayer();
const audioSet = {
  AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  AVNumberOfChannelsKeyIOS: 2,
  AVFormatIDKeyIOS: AVEncodingOption.aac,
  OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
};

const path = Platform.select({
  ios: `sound.m4a`,
  android: `${RNFetchBlob.fs.dirs.CacheDir}/sound.mp3`,
});
export const onStartRecord = async setIsRecording => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsRecording(true);
        const result = await AudioRecorderPlay.startRecorder(path,audioSet);
<<<<<<< HEAD
=======
    
>>>>>>> 894f10a0ab0e24e20aefae069f6ad244cc85fde5
      } else {
      }
    } else {
      setIsRecording(true);
      const result = await AudioRecorderPlay.startRecorder(path,audioSet);
    }
  } catch (error) {
    // console.log('Error occurred while checking recording permission:', error);
  }
};

export async function onStopRecord(setrecordingUrl, setvoiceAttachment) {
  const result = await AudioRecorderPlay.stopRecorder();
  AudioRecorderPlay.removeRecordBackListener();
  setrecordingUrl(result);
  setvoiceAttachment([
    {
      title: 'recording',
      key: '123',
      resourceUrl: result,
      contentType: 'audio/mpeg',
      encoding: '',
    },
  ]);
}

