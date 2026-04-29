import pool from '../config/db';

export interface Recipe {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  ingredients: string[];
  steps: string[];
  created_at: Date;
}

export interface CreateRecipeInput {
  name: string;
  description?: string;
  ingredients: string[];
  steps: string[];
}

export async function createRecipe(
  userId: string,
  input: CreateRecipeInput
): Promise<Recipe> {
  const { name, description, ingredients, steps } = input;

  const result = await pool.query<Recipe>(
    `INSERT INTO recipes (user_id, name, description, ingredients, steps)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, name, description ?? null, JSON.stringify(ingredients), JSON.stringify(steps)]
  );

  return result.rows[0];
}

export async function getRecipesByUser(userId: string): Promise<Recipe[]> {
  const result = await pool.query<Recipe>(
    `SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}
