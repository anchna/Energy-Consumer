import express, { Request, Response, Router } from "express";
import { loginHandler, registerHandler,verifyTokenHandler } from "../controllers/authController";


const router: Router = express.Router();

router.post('/login',loginHandler);
router.post('/register',registerHandler);
router.get('/verifyToken',verifyTokenHandler)
export default router;
