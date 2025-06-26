import express from "express";
import {getEvaluations} from "../controllers/evalController";

const router = express.Router();


router.get("/:course_id/:prof_id", getEvaluations);

export default router;