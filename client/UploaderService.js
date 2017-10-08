// var AWS = require('aws-sdk/dist/aws-sdk-react-native');
import { Config, Credentials, STS, S3 } from 'aws-sdk/dist/aws-sdk-react-native';
const Buffer = require('buffer').Buffer;

export default class UploaderService {
  constructor(token) {
    console.log(token)
    Config.region = 'us-west-1';

    const credentials = {
      RoleArn: 'arn:aws:iam::016340868115:role/CalCountGoogleAuth',
      RoleSessionName: 'Session',
      WebIdentityToken: token,
    };

    this.sts = new STS();
    this.sts.assumeRoleWithWebIdentity(credentials, (err, data) => {
      if (err) return console.log(err);
      console.log(data)
      this.credentials = data.Credentials;
    });
  }

  async upload(base64, url) {
    const fileName = `${url.substring(url.lastIndexOf('/') + 1)}`;
    console.log('uploading...');
    this.s3 = new S3({
      accessKeyId: this.credentials.AccessKeyId,
      expireTime: new Date(this.credentials.Expiration),
      secretAccessKey: this.credentials.SecretAccessKey,
      sessionToken: this.credentials.SessionToken,
      region: 'us-west-1'
    });

    return new Promise((resolve, reject) => {
      this.s3.putObject({
        Bucket: 'calcount',
        Key: fileName,
        Body: new Buffer(base64, 'base64'),
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      }, (err, data) => {
        if (err) console.log(err);
        resolve(fileName);
      });
    });
  }

  async getUrl(key) {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('getObject', {
        Bucket: 'calcount',
        Key: key
      }, (err, url) => {
        if (err) console.log(err);
        resolve(url);
      });
    });
  }

}
