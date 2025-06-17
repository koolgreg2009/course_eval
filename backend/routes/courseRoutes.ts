import express from 'express';
import {
    getAllCourses,
    getCourseByCode,
    searchCourses
} from '../controllers/courseController';

const router = express.Router();

// GET /api/courses
router.get('/', getAllCourses);

// GET /api/courses/:code
router.get('/:code', getCourseByCode);

// GET /api/courses/search
router.get('/search', searchCourses);

export default router;
