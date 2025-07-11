
async function createS3Bucket(s3Client) {
  const bucketName = `test-bucket-${Date.now()}`;
  await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );
  return bucketName;
}

module.exports = createS3Bucket;
