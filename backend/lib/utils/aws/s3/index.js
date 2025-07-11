const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const BUCKET_NAME = process.env.AWS_BUCKET;
const AWS_REGION = process.env.AWS_REGION;
function initializeS3Client() {
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  return s3Client;
}
const s3Client = initializeS3Client();

async function getObjectUrl(objectKey) {
  return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`;
}
async function uploadToS3Bucket(objectKey, objectBody) {
  const s3Client = initializeS3Client();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: objectBody,
      // ACL: 'public-read'
      ContentDisposition: "inline"
    })
  );
}

module.exports = {
  s3Client,
  uploadToS3Bucket,
  getObjectUrl,
};
