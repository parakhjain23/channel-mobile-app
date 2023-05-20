import {Platform} from 'react-native';
import {FileUploadApi} from '../../api/attachmentsApi/FileUploadApi';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

export const uploadRecording = async (recordingUrl, accessToken) => {
  try {
    const Files = [
      {
        name: 'sound.mp3',
        uri: recordingUrl,
        type: 'audio/mp3',
      },
    ];
    const FileNames = await FileUploadApi(Files, accessToken);
    const attachment = FileNames?.map((file, index) => {
      return {
        title: file,
        key: file,
        resourceUrl: `https://resources.intospace.io/${file}`,
        contentType: 'audio/mp3',
        encoding: '',
      };
    });
    return attachment;
  } catch (error) {
    console.warn(error, 'error');
  }
};
async function RecordingUrl() {
  const cacheDirPath = RNFetchBlob.fs.dirs.CacheDir;
  const sourcePath = RNFS.CachesDirectoryPath + '/sound.m4a';
  const destinationPath = RNFS.CachesDirectoryPath + '/sound.mp3';

  const fileName = 'sound.mp3';
  const uri = `file://${cacheDirPath}/${fileName}`;
  if (Platform?.OS === 'ios') {
    await RNFS.exists(destinationPath)
      .then(exists => {
        if (exists) {
          RNFS.exists(sourcePath).then(sourceExists => {
            if (sourceExists) {
              RNFS.unlink(destinationPath)
                .then(() => {
                })
                .catch(error => {
                });
            } else {
            }
          });
        } else {
          RNFS.moveFile(sourcePath, destinationPath)
            .then(() => {
            })
            .catch(error => {
            });
        }
      })
      .catch(error => {
      });
    return uri;
  } else {
    return uri;
  }
}
