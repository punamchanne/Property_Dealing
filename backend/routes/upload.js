const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images, 3D models, and 360 images
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'model/gltf-binary',
            'model/gltf+json',
            'application/octet-stream'
        ];

        if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(glb|gltf)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and 3D models are allowed.'));
        }
    }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `property_dealing/${folder}`,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// @route   POST /api/upload/image
// @desc    Upload property images
// @access  Private (Owner/Admin)
router.post('/image', protect, authorize('owner', 'admin'), upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'images', 'image');

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

// @route   POST /api/upload/images
// @desc    Upload multiple property images
// @access  Private (Owner/Admin)
router.post('/images', protect, authorize('owner', 'admin'), upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadPromises = req.files.map(file =>
            uploadToCloudinary(file.buffer, 'images', 'image')
        );

        const results = await Promise.all(uploadPromises);

        const images = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id
        }));

        res.json({
            success: true,
            message: 'Images uploaded successfully',
            data: images
        });
    } catch (error) {
        console.error('Images upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
        });
    }
});

// @route   POST /api/upload/model
// @desc    Upload 3D model
// @access  Private (Owner/Admin)
router.post('/model', protect, authorize('owner', 'admin'), upload.single('model'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'models', 'raw');

        res.json({
            success: true,
            message: '3D model uploaded successfully',
            data: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });
    } catch (error) {
        console.error('Model upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading 3D model',
            error: error.message
        });
    }
});

// @route   POST /api/upload/360
// @desc    Upload 360° image
// @access  Private (Owner/Admin)
router.post('/360', protect, authorize('owner', 'admin'), upload.single('image360'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { roomName } = req.body;

        const result = await uploadToCloudinary(req.file.buffer, '360', 'image');

        res.json({
            success: true,
            message: '360° image uploaded successfully',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                roomName: roomName || 'Room'
            }
        });
    } catch (error) {
        console.error('360 upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading 360° image',
            error: error.message
        });
    }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete uploaded file from Cloudinary
// @access  Private (Owner/Admin)
router.delete('/:publicId', protect, authorize('owner', 'admin'), async (req, res) => {
    try {
        const publicId = req.params.publicId.replace(/-/g, '/');

        await cloudinary.uploader.destroy(publicId);

        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting file',
            error: error.message
        });
    }
});

module.exports = router;
