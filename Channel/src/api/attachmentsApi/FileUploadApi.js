import uuid from 'react-native-uuid';
export const FileUploadApi = async (Files, accessToken) => {
  const fileNames = Files?.map(item => {
    const folder = uuid.v4();
    return `${folder}/${item?.name || item?.fileName}`;
  });
  try {
    const presignedUrl = await fetch(
      'https://api.intospace.io/chat/fileUpload',
      {
        method: 'POST',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileNames: fileNames,
        }),
      },
    );
    const Genereated_URL = await presignedUrl.json();
    const signedUrls = Object.values(Genereated_URL);
    const uploadPromises = signedUrls.map(async (s3BucketUrl, index) => {
      const fileUri = await fetch(Files[index]?.uri);
      const imageBody = await fileUri.blob();
      const fileType = Files[index]?.type;
      await UploadDocumentApi(s3BucketUrl, fileType, imageBody);
      return fileNames[index];
    });
    const uploadedFileNames = await Promise.all(uploadPromises);
    return uploadedFileNames;
  } catch (error) {
    console.warn(error, 'error in file uplloadi');
    return null;
  }
};

const UploadDocumentApi = async (s3BucketUrl, fileType, imageBody) => {
  try {
    await fetch(s3BucketUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      body: imageBody,
    });
  } catch (error) {
    console.warn(error, 'error in uploadDocumentApi');
  }
};
