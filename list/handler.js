'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3();
const AWS_URL = 'http://thanhct-laravel.s3.amazonaws.com/';

module.exports.listS3 = async (event, context, uploadCallback) => {
  console.log(event);
  var MaxKeys = event.queryStringParameters.max_keys || 20;
  var params = {
    Bucket: 'thanhct-laravel', /* required */
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
