const { uploadToDrive } = require('../utils/driveUploader'); // Assuming this is defined elsewhere
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/zip',
    'application/x-zip-compressed',
    'multipart/x-zip',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const fileController = {
  uploadFile: [
    upload.single('file'),
    async (req, res) => {
      try {
        const { path, originalname } = req.file;
        const driveFile = await uploadToDrive(path, originalname);
        res.json({ fileId: driveFile.id, fileUrl: driveFile.webViewLink });
      } catch (err) {
        console.error('Error uploading file:', err.message);
        res.status(500).json({ error: err.message });
      }
    },
  ],
};

module.exports = fileController;