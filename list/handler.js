'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3();
const LIST_BUCKET = process.env.LIST_BUCKET
const AWS_URL = 'http://' + LIST_BUCKET + '.s3.amazonaws.com/';

module.exports.listS3 = async (event, context, uploadCallback) => {
  console.log(event);
  var MaxKeys = 20;
  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
      if (event.queryStringParameters.max_keys !== undefined &&
          event.queryStringParameters.max_keys !== null &&
          event.queryStringParameters.max_keys !== "") {
          MaxKeys = event.queryStringParameters.max_keys;
      }
  }
  var params = {
    Bucket: LIST_BUCKET, /* required */
    // Delimiter: 'STRING_VALUE',
    // EncodingType: url,
    // Marker: 'STRING_VALUE',
    MaxKeys: MaxKeys,
    Prefix: 'files',
    // RequestPayer: requester
  };

  return listObject(event, context, params, uploadCallback)
      .then((data) => {
        finishRequest(200, JSON.stringify(data) , 'application/json', uploadCallback);
      })
      .catch((err) => {
        finishRequest(400, err, 'application/json', uploadCallback);
  });
};

function listObject(event, context, params, uploadCallback) {
  return new Promise((resolve, reject) => {
    var listUrl = [];
    s3.listObjectsV2(params, function(err, data) {
       if (err) {
         console.log(err, err.stack); // an error occurred
         return reject(err);
       } else {
         var contents = data.Contents;
         contents.forEach((element, index) => {
           var objectUrl = AWS_URL + element.Key;
           listUrl.push(objectUrl);
         })
         resolve(listUrl);
      };
    });
  });
};

function finishRequest(statusCode, body, contentType, uploadCallback, isBase64Encoded = false) {
  uploadCallback(null, {
    statusCode: statusCode,
    isBase64Encoded: isBase64Encoded,
    body: body,
    headers: {
      'Content-Type': contentType
    }
  });
}
