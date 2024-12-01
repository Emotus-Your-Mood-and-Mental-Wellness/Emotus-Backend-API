const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket('emotus-backend'); // Gantilah dengan nama bucket Anda

// Fungsi untuk meng-upload file ke Google Cloud Storage
exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        // Nama file yang diupload
        const file = req.file;
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('finish', () => {
            res.status(200).send('File uploaded successfully');
        });

        blobStream.end(file.buffer);
    } catch (error) {
        res.status(500).send('Error uploading file');
    }
};
