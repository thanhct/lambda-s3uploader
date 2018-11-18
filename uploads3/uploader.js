'use strict';
const aws = require('aws-sdk');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const s3 = new aws.S3();

const destBucket = 'thanhct-laravel';

module.exports.uploads3 = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'upload',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
