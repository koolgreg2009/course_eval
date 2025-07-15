import express from "express";
import {getCourseAggregate, getEvaluations} from "../controllers/evalController";

const router = express.Router();


router.get("/search", getEvaluations);
router.get("/bar", getCourseAggregate);

export default router;