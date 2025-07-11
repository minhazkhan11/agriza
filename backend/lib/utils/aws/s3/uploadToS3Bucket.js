const { initializeS3Client } = require(".");

async function uploadToS3Bucket(objectKey, objectBody) {
  const s3Client = initializeS3Client();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: objectBody,
      // ACL:'public-read'
    })
  );
}
module.exports = uploadToS3Bucket;
