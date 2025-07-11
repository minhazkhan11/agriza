const {s3Client} =require('.');

async function deleteS3Bucket(s3Client, bucketName) {
  const paginator = paginateListObjectsV2(
    { client: s3Client },
    { Bucket: bucketName }
  );
  for await (const page of paginator) {
    const objects = page.Contents;
    if (objects) {
      for (const object of objects) {
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
        );
      }
    }
  }
  await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
}
module.exports = deleteS3Bucket;
