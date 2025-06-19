import express from 'express';
import {
    getCourseAggregateByCode,
    getCourseEvalByCode,
    searchCourses
} from '../controllers/courseController';

const router = express.Router();

// GET /api/courses
router.get('/', getCourseAggregateByCode);

// GET /api/courses/:code
router.get('/:code', getCourseAggregateByCode);

// GET /api/courses/search
router.get('/search', getCourseAggregateByCode);

export default router;
