"use strict";
const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const { v4: uuidv4 } = require("uuid");
const {uploadToS3Bucket,getObjectUrl}=require('./aws/s3')
const saveHtmlAndImageToS3 = async (
  htmlContent,
  rootFolderName,
  folderName,
  itemId = uuidv4()
) => {
  try {
    // Define the regular expression to match image data URLs
    const regex = /<img\s+src="data:image\/[^"]+"[^>]*>/g;

    // Find all matches in the HTML content
    const matches = htmlContent.match(regex) || [];

    // Initialize an array to store image data
    const images = [];
    let totalImages = 0; // Variable to count the total number of images

    let htmlText = "";
    // Iterate over each matched image element
    for (const match of matches) {
      // Extract base64 data from the image element
      const base64Image = match
        .match(/src="data:image\/[^"]+"/)[0]
        .replace(/^src="data:image\/\w+;base64,/, "");

      // Set the image extension based on the identified image type
      const imageExtension =
        match.match(/\/(png|jpeg|jpg|gif);base64,/)[1] || "png";
      let s3Url = "";
      // store the image to s3
      try {
        const objectKey = `${rootFolderName}/${folderName}/${itemId}.${imageExtension}`;
        const objectBody = Buffer.from(base64Image, "base64");

        await uploadToS3Bucket(objectKey, objectBody);
        s3Url = await getObjectUrl(objectKey);
        console.log("Image URL:", s3Url);
      } catch (e) {
        console.error("Error uploading image to S3:", e);
        // throw new Error("Failed to upload image to S3");
      }

      // Replace the src attribute with the actual image path
      htmlContent = htmlContent.replace(
        match,
        `<img src="${s3Url || ""}" alt="Image"/>`
      );

      htmlText = htmlContent.replace(
        `<img src="${s3Url || ""}" alt="Image"/>`,
        ""
      );

      // Store the image data for reference
      images.push({ image_url: s3Url, image_path: s3Url });

      totalImages++; // Increment the totalImages count
    }

    return { totalImages, images, html: htmlContent, htmlText };
  } catch (error) {
    // Return the error message directly
    return { success: false, message: `Error: ${error.message}` };
  }
};

module.exports = saveHtmlAndImageToS3;