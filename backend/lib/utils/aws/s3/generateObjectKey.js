const path = require('path');

const generateObjectKey = (entityType, fileName) => {
  const ext = path.extname(fileName);
  return `${entityType}/agriza-${Date.now()}${ext}`;
};

module.exports = generateObjectKey;
