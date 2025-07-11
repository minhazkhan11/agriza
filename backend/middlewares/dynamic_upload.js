// 'use strict';

// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const dynamicUpload = upload.fields([
//   { name: "self_attested_pan", maxCount: 1 },
//   { name: "bank_statement", maxCount: 1 }
// ]);

// module.exports = dynamicUpload;
'use strict';

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const dynamicUpload = upload.fields([
  { name: "self_attested_pan", maxCount: 1 },
  { name: "self_attested_adhaar", maxCount: 1 },
  { name: "bank_statement", maxCount: 1 },
  { name: "attested_pan_of_the_partnership", maxCount: 1 },
  { name: "partnership_agreement", maxCount: 1 },
  { name: "attested_pan_of_the_authorized_signatory", maxCount: 1 },
  { name: "attested_adhaar_of_the_authorized_signatory", maxCount: 1 },
  { name: "any_local_registration_number_document", maxCount: 1 },
  { name: "govt_license_of_the_retaller", maxCount: 1 },
  { name: "signatory_photo", maxCount: 1 },
  { name: "pan_of_the_company", maxCount: 1 },
  { name: "certificate_of_incorporation", maxCount: 1 },
  { name: "moa_of_the_company", maxCount: 1 },
  { name: "aoa_of_the_company", maxCount: 1 },
  { name: "gst_returns_of_last_year", maxCount: 1 },
  { name: "gst_certificate", maxCount: 1 },
  { name: "additional_documents", maxCount: 1 }
]);

module.exports = dynamicUpload;
