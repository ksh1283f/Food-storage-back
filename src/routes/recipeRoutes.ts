import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  saveRecipe,
  getUserRecipes,
  recommendRecipes,
} from '../controllers/recipeController';

const router = Router();

router.use(authenticate);

router.post('/', saveRecipe);
router.get('/', getUserRecipes);
router.post('/ai-recommend', recommendRecipes);

export default router;
