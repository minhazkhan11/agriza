'use strict';
const path = require('path');
const fs = require('fs');
const { constants } = require('../../config');
const Attachments = require('../../models/attachments');

// add attachment function
async function uploadImage(imageFile, folderName, imagePrefix, entityId, entityType, addedBy) {
  try {
    const originalPath = imageFile.path;
    const ext = path.extname(imageFile.originalname);
    const newName = `${imagePrefix}_${entityId}_${Date.now()}${ext}`;
    const newPath = path.join(__dirname, `../../public/uploads/${folderName}/${newName}`);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, `../../public/uploads/${folderName}`))) {
      fs.mkdirSync(path.join(__dirname, `../../public/uploads/${folderName}`), { recursive: true });
    }

    // Rename the image file
    fs.renameSync(originalPath, newPath);

    // Update the file path in the request object for further processing
    imageFile.path = newPath;

    // Insert data in Attachments
    const attData = {
      photo_path: newPath,
      entity_id: entityId,
      entity_type: entityType,
      active_status: 'active',
      added_by: addedBy,
    };

    // TODO: Insert data in Attachments (use your database library to insert data)
    const attachment = await new Attachments(attData).save()

    return newPath; // or return any relevant information about the uploaded image
  } catch (error) {
    throw error;
  }
}


// external function to update image
async function updateImage(imageFile, folderName, imagePrefix, entityId, entityType, addedBy) {
  const originalPath = imageFile.path;
  const ext = path.extname(imageFile.originalname);
  const newName = `${imagePrefix}_${entityId}_${Date.now()}${ext}`;

  const newPath = path.join(__dirname, `../../public/uploads/${folderName}/${newName}`);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, `../../public/uploads/${folderName}`))) {
    fs.mkdirSync(path.join(__dirname, `../../public/uploads/${folderName}`), { recursive: true });
  }

  // Rename the image file
  fs.renameSync(originalPath, newPath);

  // Update the file path in the request object for further processing
  imageFile.path = newPath;

  const attData = {};
  attData.photo_path = newPath;
  attData.entity_id = entityId;
  attData.entity_type = entityType;
  attData.added_by = addedBy;

  let isAttachment = await Attachments.where({
    entity_id: entityId,
    entity_type: entityType,
    active_status: constants.activeStatus.active
  }).fetch({ require: false });

  if (isAttachment) {
    if (fs.existsSync(isAttachment.toJSON().photo_path)) {
      fs.unlinkSync(isAttachment.toJSON().photo_path);
    }
    await new Attachments()
      .where({ id: isAttachment.id })
      .save(attData, { method: 'update' });
  } else {
    await new Attachments(attData).save();
  }
  return newPath;
}

// split image url
// const processAttachment = (data) => {
//   if (!data || JSON.stringify(data) === '{}') {
//     return '';
//   } else {
//     const url = data.photo_path;
//     // Check if the file exists
//     if (!fs.existsSync(url)) {
//       return '';
//     }
//     const newUrl = url.split('public');
//     return process.env.BASE_URL + newUrl[1];
//   }
// };

const processAttachment = (data) => {
  if (!data || !data.photo_path) {
    return '';
  }
  return data.photo_path; // S3 URL directly
};

module.exports = {
  uploadImage,
  updateImage,
  processAttachment,
  uploadFile: uploadImage,
  updateFile: updateImage,
};
