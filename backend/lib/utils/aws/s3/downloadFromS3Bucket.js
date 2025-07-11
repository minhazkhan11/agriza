async function downloadFromS3Bucket(s3Client, bucketName, objectKey) {
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    })
  );
  return await Body.transformToString();
}
module.exports = downloadFromS3Bucket;
