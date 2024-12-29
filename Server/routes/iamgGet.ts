import { Router } from "express";
import { imageHandler } from "../controllers/imageHandler";
const router = Router();
router.post('/',imageHandler);
export default router;