import { Request, Response } from 'express';
import * as recipeService from '../services/recipeService';
import { getAIRecipes } from '../services/openaiService';

export async function saveRecipe(req: Request, res: Response): Promise<void> {
  const userId = req.user!.uid;
  const { name, description, ingredients, steps } = req.body as recipeService.CreateRecipeInput;

  if (!name || !Array.isArray(ingredients) || !Array.isArray(steps)) {
    res.status(400).json({ error: 'name, ingredients, steps are required' });
    return;
  }

  const recipe = await recipeService.createRecipe(userId, {
    name,
    description,
    ingredients,
    steps,
  });

  res.status(201).json(recipe);
}

export async function getUserRecipes(req: Request, res: Response): Promise<void> {
  const userId = req.user!.uid;
  const recipes = await recipeService.getRecipesByUser(userId);
  res.json(recipes);
}

export async function recommendRecipes(req: Request, res: Response): Promise<void> {
  const result = await getAIRecipes(req.body);
  res.json(result);
}
