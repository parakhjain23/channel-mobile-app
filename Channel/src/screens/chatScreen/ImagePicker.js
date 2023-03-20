import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {FileUploadApi} from '../../api/attachmentsApi/FileUploadApi';

export const launchCameraForPhoto = (accessToken, setAttachment) => {
  const optionsForCamera = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  launchCamera(optionsForCamera, async data => {
    // console.log(data.assets);
    try {
      const FileNames = await FileUploadApi(data?.assets, accessToken);
      const attachment = FileNames?.map((file, index) => {
        return {
          title: data?.assets?.[index]?.fileName,
          key: file,
          resourceUrl: `https://resources.intospace.io/${file}`,
          contentType: data?.assets?.[index]?.type,
          size: 18164,
          encoding: '',
        };
      });
      console.log(attachment, '-=-=-=-');
      setAttachment(prevAttachment => [...prevAttachment, ...attachment]);
    } catch (error) {
      console.log(error, 'error');
    }
  });
};
export const launchGallery = (accessToken,setAttachment) => {
  const options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    selectionLimit: 0,
  };
  launchImageLibrary(options, async data => {
    try {
      const FileNames = await FileUploadApi(data?.assets, accessToken);
      const attachment = FileNames?.map((file, index) => {
        return {
          title: data?.assets?.[index]?.fileName,
          key: file,
          resourceUrl: `https://resources.intospace.io/${file}`,
          contentType: data?.assets?.[index]?.type,
          size: 18164,
          encoding: '',
        };
      });
      console.log(attachment, '-=-=-=-');
      setAttachment(prevAttachment => [...prevAttachment, ...attachment]);
    } catch (error) {
      console.log(error, 'error');
    }
  });
};
