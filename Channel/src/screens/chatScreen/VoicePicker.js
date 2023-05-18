import {Platform} from 'react-native';
import {FileUploadApi} from '../../api/attachmentsApi/FileUploadApi';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

export const uploadRecording = async (recordingUrl, accessToken) => {
  try {
    // const url = await RecordingUrl();
    // console.log('url-0-0-0-0-0-0-0-0', url);
    const Files = [
      {
        name: 'sound.mp3',
        uri: recordingUrl,
        type: 'audio/mp3',
      },
    ];
    const FileNames = await FileUploadApi(Files, accessToken);
    // console.log(FileNames, 'filename in voice picker');
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
  // const sourcePath = 'file://' + cacheDirPath + '/sound.m4a';
  // const destinationPath = 'file://' + cacheDirPath + '/sound.mp3';
  const sourcePath = RNFS.CachesDirectoryPath + '/sound.m4a';
  const destinationPath = RNFS.CachesDirectoryPath + '/sound.mp3';

  const fileName = 'sound.mp3';
  const uri = `file://${cacheDirPath}/${fileName}`;
  if (Platform?.OS === 'ios') {
    // RNFS.readFile(sourcePath, (err, data) => {
    //   if (err) {
    //     console.log('Error reading file:', err);
    //   } else {
    //     RNFS.writeFile(destinationPath, data, err => {
    //       if (err) {
    //         console.log('Error writing file:', err);
    //       } else {
    //         console.log('File transferred successfully!');
    //       }
    //     });
    //   }
    // });
    await RNFS.exists(destinationPath)
      .then(exists => {
        if (exists) {
          RNFS.exists(sourcePath).then(sourceExists => {
            if (sourceExists) {
              RNFS.unlink(destinationPath)
                .then(() => {
                  console.log('File moved successfully!');
                })
                .catch(error => {
                  console.log('Error deleting file: ', error);
                });
            } else {
              console.log('Source file does not exist');
            }
          });
        } else {
          RNFS.moveFile(sourcePath, destinationPath)
            .then(() => {
              console.log('File moved successfully!');
              // RNFS.readDir(sourcePath, (err, data) => {
              //   if (err) {
              //     console.log('Error reading file:', err);
              //   } else {
              //     RNFS.writeFile(destinationPath, data, err => {
              //       if (err) {
              //         console.log('Error writing file:', err);
              //       } else {
              //         console.log('File transferred successfully!');
              //       }
              //     });
              //   }
              // });
            })
            .catch(error => {
              console.log('Error moving file: ', error);
            });
        }
      })
      .catch(error => {
        console.log('Error checking file existence: ', error);
      });
    return uri;
  } else {
    return uri;
  }
}
