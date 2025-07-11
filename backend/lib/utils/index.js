const { ErrorHandler } = require('./custom.error');
const jwtUtil = require('./jwt.util');
const sendOtp = require('./sendOtp');
const sendEmail = require('./sendEmail');
const joiSchemas = require('./joi.schemas');
const { uploadImage, updateImage, processAttachment, uploadFile, updateFile } = require('./attachments');
const saveHtmlAndImageToS3 = require('./aws.attachment');
const { uploadToS3Bucket, getObjectUrl } = require('./aws/s3')

module.exports = {
    ErrorHandler,
    jwtUtil,
    joiSchemas,
    uploadImage,
    updateImage,
    processAttachment,
    uploadFile,
    updateFile,
    sendOtp,
    saveHtmlAndImageToS3,
    uploadToS3Bucket,
    sendEmail
};
