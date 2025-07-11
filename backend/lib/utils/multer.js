const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// storage
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../../public/uploads");

        try {
            // Ensure the destination directory exists
            await fs.promises.mkdir(uploadPath, { recursive: true });
        } catch (error) {
            // Handle any errors while creating the directory
            return cb(error, null);
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Use a more descriptive filename (timestamp + original filename)
        const timestamp = Date.now();
        const originalName = path.basename(file.originalname);
        const uniqueFilename = `${uuidv4()}_${timestamp}_${originalName}`;
        cb(null, uniqueFilename);
    },
});
const memoryStorage = multer.memoryStorage();
// images
const imgFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Allow a variety of image file extensions
    const allowedImageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp', '.svg']; // Add more extensions as needed

    if (!allowedImageExtensions.includes(ext)) {
        req.fileValidationError = 'Only images are allowed (PNG, JPG, JPEG, GIF, BMP, TIFF, WebP, SVG, etc.)';
        return cb(null, false, req.fileValidationError);
    }

    cb(null, true);
};

// pdf
const pdfFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
        req.fileValidationError = 'Only PDF files are allowed';
        return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
};


const allFile = (req, file, cb) => {
    // Allow all file extensions
    cb(null, true);
};

// video
const videoFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Allow a variety of video file extensions
    const allowedVideoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.mpeg', '.mpg', '.3gp', '.m4v', '.ogv']; // Add more extensions as needed

    if (!allowedVideoExtensions.includes(ext)) {
        req.fileValidationError = 'Only video files are allowed (MP4, AVI, MOV, MKV, WMV, FLV, WebM, MPEG, MPG, 3GP, M4V, OGV, etc.)';
        return cb(null, false, req.fileValidationError);
    }

    cb(null, true);
};


// document
const documentFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Allow a variety of document file extensions
    const allowedDocumentExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.odt', '.txt']; // Add more extensions as needed

    if (!allowedDocumentExtensions.includes(ext)) {
        req.fileValidationError = 'Only documents are allowed (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ODT, TXT, etc.)';
        return cb(null, false, req.fileValidationError);
    }

    cb(null, true);
};

// CSV filter
const csvFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') {
        req.fileValidationError = 'Only CSV files are allowed';
        return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
};


const upload = multer({ storage: storage, fileFilter: imgFilter });
const uploadPdf = multer({ storage: storage, fileFilter: pdfFilter });
const file = multer({ storage: storage, fileFilter: allFile });
const uploadVideo = multer({ storage: storage, fileFilter: videoFilter });
const uploadCsv = multer({ storage: storage, fileFilter: csvFilter });
const uploadImages = multer({ storage: memoryStorage, fileFilter: imgFilter });
const uploadFileMemory = multer({ storage: memoryStorage, fileFilter: allFile });
const documentuplodes = multer({ storage: memoryStorage, fileFilter: documentFilter });

module.exports = { upload, uploadPdf, file, uploadVideo, uploadCsv, uploadImages, uploadFileMemory, documentuplodes };
