import express from 'express';
import {
    getCourseAggregateByCode,
    getCourseEvalByCode
} from '../controllers/courseController';

const router = express.Router();

// GET /api/courses/search
router.use((req, res, next) => {
    // console.log('🧭 [courseRoutes] route hit:');
    // console.log(' - baseUrl:', req.baseUrl);       // e.g. /api/courses
    // console.log(' - path:', req.path);             // e.g. /search
    // console.log(' - originalUrl:', req.originalUrl); // e.g. /api/courses/search
    next();
});


router.get('/aggregate', getCourseAggregateByCode);
router.get('/evals', getCourseEvalByCode);
export default router;
