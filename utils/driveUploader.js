const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

class DriveUploader {
  static async initializeDrive() {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../credentials.json'), // Path to your Google API credentials
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
      const drive = google.drive({ version: 'v3', auth });
      return drive;
    } catch (err) {
      throw new Error('Error initializing Google Drive: ' + err.message);
    }
  }

  static async uploadFile(filePath, fileName, mimeType, folderId = null) {
    try {
      const drive = await this.initializeDrive();
      const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : [],
      };
      const media = {
        mimeType: mimeType,
        body: fs.createReadStream(filePath),
      };
      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink',
      });
      return {
        id: response.data.id,
        name: response.data.name,
        link: response.data.webViewLink,
      };
    } catch (err) {
      throw new Error('Error uploading file to Google Drive: ' + err.message);
    }
  }

  static async deleteFile(fileId) {
    try {
      const drive = await this.initializeDrive();
      await drive.files.delete({ fileId });
      return { success: true };
    } catch (err) {
      throw new Error('Error deleting file from Google Drive: ' + err.message);
    }
  }
}

module.exports = DriveUploader;