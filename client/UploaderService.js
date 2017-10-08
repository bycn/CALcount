var AWS = require('aws-sdk/dist/aws-sdk-react-native');
var b64 = require('base-64');
var blobUtil = require('blob-util');

export default class UploaderService {
  constructor(token) {
    AWS.config.region = 'us-west-1';

    AWS.config.credentials = new AWS.WebIdentityCredentials({
      RoleArn: 'arn:aws:iam::016340868115:role/CalCountGoogleAuth',
      WebIdentityToken: token,
    });

    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: 'calcount'}
    });
  }

  async _srcToFile(src, fileName, mimeType){
    return (fetch(src)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], fileName, { type: mimeType }))
    );
  }

  async upload(base64, url) {
    const fileName = `${new Date().toLocaleDateString()}${url.substring(url.lastIndexOf('/'))}`;
    
    return blobUtil.imgSrcToBlob(url).then((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve, reject) => {
        this.s3.upload({
          Key: fileName,
          Body: reader.files[0],
        }, (err, data) => {
          if (err) console.log(err);
          resolve(data);
        });
      });
    }).catch(err => console.log(err));
    // const file = new Blob([b64.decode(base64)], {
    //   type: 'image/jpeg',
    //   encoding: 'utf-8',
    // });
  }

}
