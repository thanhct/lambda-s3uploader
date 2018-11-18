'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3();

module.exports.listS3 = async (event, context) => {
  console.log(s3);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Lists3',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
