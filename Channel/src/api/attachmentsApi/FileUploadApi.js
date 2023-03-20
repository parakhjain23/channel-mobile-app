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

    for (const [index, s3BucketUrl] of signedUrls.entries()) {
      const fileUri = await fetch(Files[index]?.uri);
      const imageBody = await fileUri.blob();
      const fileType = Files[index]?.type;
      await UploadDocumentApi(s3BucketUrl, fileType, imageBody);
    }
    return fileNames;
  } catch (error) {
    console.warn(error);
  }
};

const UploadDocumentApi = async (s3BucketUrl, fileType, imageBody) => {
  const uploadDocToS3 = await fetch(s3BucketUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: imageBody,
  });
  //   const downloadDocUrl = JSON.stringify(uploadDocToS3);
  //   console.log(downloadDocUrl, 'result from upload document api');
};
