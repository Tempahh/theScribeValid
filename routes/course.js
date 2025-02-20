const express = require('express');
const Course = require('../models/Course');
const auth  = require('../middleware/auth');
const {body, validationResult} = require('express-validator');
const courseValidationMiddleware = require('../validators/courseValidator');
const {upload} = require('../utils/cloudinary');

const router = express.Router();

// Create a new course
router.post(
    '/create',
    auth,
    courseValidationMiddleware,
    async (req, res) => {
        try {
            if (req.user.role !== 'instructor') {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Create & save course
            const course = new Course(req.body);
            await course.save();

            res.status(201).json({ message: 'Course created successfully', course });
        } catch (error) {
            console.error('Error creating course:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
);

//update course
router.put("/update/:id", auth, courseValidationMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.set(req.body);
        await course.save();

        res.json({ message: 'Course updated successfully', course });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

//delete course
router.delete("/delete/:id", auth, courseValidationMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.remove();

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

//enroll in course
router.post("/enroll/:id", auth, courseValidationMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        course.students.push(req.user._id);
        await course.save();

        res.json({ message: 'Enrolled successfully', course });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.json({ message: 'File uploaded successfully', url: req.file.path });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

router.get('/analytics', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const analytics = await Course.aggregate([
            { $project: { title: 1, totalStudents: { $size: '$students' } } }
        ]);

        res.json({ analytics });
    } catch (error) {
        res.status(500).json({ message: 'Analytics fetch failed', error: error.message });
    }
});

module.exports = router;