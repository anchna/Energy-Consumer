import express,{Router} from 'express'
import { hashtagHandler } from '../controllers/hashtagController';
const route:Router = express.Router();
route.post('/',hashtagHandler);
export default route;