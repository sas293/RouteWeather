import express from 'express';
import { getIntermediateLocations } from '../controllers/route.js';
import { routeLimiter } from '../middlewares/rateLimiter.js';


const router = express.Router();
router.post( '/intermediate-locations',routeLimiter,getIntermediateLocations );
export default router;