import express from 'express';
import {
    logSearchHTTP
} from '../controllers/logController';

const router = express.Router();

router.post('/search', logSearchHTTP);
export default router;