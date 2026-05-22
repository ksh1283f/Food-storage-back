import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { syncProfile } from '../controllers/authController';

const router = Router();

router.use(authenticate);

router.post('/login', syncProfile);

export default router;
