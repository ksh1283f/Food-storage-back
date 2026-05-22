import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getProfile, deleteAccount } from '../controllers/authController';

const router = Router();

router.use(authenticate);

router.get('/me', getProfile);
router.delete('/me', deleteAccount);

export default router;
