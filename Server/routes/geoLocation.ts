
import { Request,Response, Router } from "express";
import { geoLocationHandler } from "../controllers/GeoLocationController";
const router:Router = Router();
router.post('/',geoLocationHandler);
export default router;