

const path = require('path');

const generateObjectKeyMultiple = (entityType, type, fileName) => {
  const ext = path.extname(fileName);
  return `${entityType}/${type}/agriza-${Date.now()}${ext}`;
};

module.exports = generateObjectKeyMultiple;
