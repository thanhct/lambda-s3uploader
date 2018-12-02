'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const STORE_BUCKET = process.env.STORE_BUCKET;

exports.handler = async (event) => {
    console.log(event);
    // parse body to json
    let bodyJson = JSON.parse(event.body);
    let imageData = Buffer.from(bodyJson.file.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    let params = {
        Body: imageData,
        Bucket: STORE_BUCKET,
        Key: bodyJson.fileName,
        ACL: 'private'
    };

    let data = await putS3(params);
    // TODO implement
    const response = {
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'

        },
        "statusCode": 200,
        "body": JSON.stringify(data),
        "isBase64Encoded": false
    };
    return response;
};

function putS3(params) {
    return new Promise((resolve, reject) => {
        s3.putObject(params, (error, data) => {
            if (data) {
                resolve(data);
            } else {
                reject(error);
            }

        })

    })
}
