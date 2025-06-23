import express from 'express';
import {
    getCourseAggregateByCode,
    getCourseEvalByCode,
    searchCourses
} from '../controllers/courseController';

const router = express.Router();

 // GET /api/courses
// router.get('/', getCourseAggregateByCode);
//
// // GET /api/courses/:code
// router.get('/:code', getCourseAggregateByCode);

// GET /api/courses/search
router.use((req, res, next) => {
    console.log('🧭 [courseRoutes] route hit:');
    console.log(' - baseUrl:', req.baseUrl);       // e.g. /api/courses
    console.log(' - path:', req.path);             // e.g. /search
    console.log(' - originalUrl:', req.originalUrl); // e.g. /api/courses/search
    next();
});


router.get('/code', getCourseAggregateByCode);

export default router;
