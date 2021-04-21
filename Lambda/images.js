const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'xxxxxxxxxxxx',
  secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxx',
  region: 'us-east-1',
  signatureVersion: 'v4'
});

const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

exports.getPreSignedURLToPutToS3 = function(event, context, callback) {
  // What does this function do?
  // 1. Receive the filename to be uploaded and Create a request param to make a request to create pre-signed URL to upload to S3
  // 2. Make the request to S3
  // 3. Get the pre-signed URL from S3
  // 4. Send the pre-signed URL from S3 as response

  // 1. Receive the filename to be uploaded and Create a request param to make a request to create pre-signed URL to upload to S3
  let requestObject = JSON.parse(event["body"]);

  S3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: requestObject.fileName,
    ContentType: requestObject.fileType
  }, function (err, url) {
    let response = {};
    if(err) {
      response = {
        statusCode: 400,
        headers: {},
        body: JSON.stringify(err)
      };
    } else {
      response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(url)
      };
    }
    callback(null, response);
  });
};