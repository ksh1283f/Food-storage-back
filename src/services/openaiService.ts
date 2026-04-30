import OpenAI from 'openai';
import crypto from 'crypto';
import pool from '../config/db';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RecipeRecommendInput {
  ingredients: string[];
  expiringIngredients: string[];
  preferences?: { difficulty?: string };
}

interface RecipeItem {
  name: string;
  description: string;
  ingredients: string[];
  missingIngredients: string[];
  steps: string[];
  score: number;
}

interface RecipeRecommendResult {
  recipes: RecipeItem[];
}

function buildCacheKey(input: RecipeRecommendInput): string {
  const normalized = JSON.stringify({
    ingredients: [...input.ingredients].sort(),
    expiringIngredients: [...input.expiringIngredients].sort(),
    difficulty: input.preferences?.difficulty ?? 'easy',
  });
  return crypto.createHash('md5').update(normalized).digest('hex');
}

export async function getAIRecipes(
  input: RecipeRecommendInput
): Promise<RecipeRecommendResult> {
  const cacheKey = buildCacheKey(input);

  const cached = await pool.query<{ result: RecipeRecommendResult }>(
    'SELECT result FROM recipe_cache WHERE cache_key = $1',
    [cacheKey]
  );
  if (cached.rows.length > 0) {
    return cached.rows[0].result;
  }

  const { ingredients, expiringIngredients, preferences } = input;
  const prompt = buildPrompt({ ingredients, expiringIngredients, preferences });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a professional chef AI.' },
      { role: 'user', content: prompt },
    ],
  });

  const text = response.choices[0].message.content ?? '{}';
  const result = JSON.parse(text) as RecipeRecommendResult;

  await pool.query(
    'INSERT INTO recipe_cache (cache_key, result) VALUES ($1, $2) ON CONFLICT (cache_key) DO NOTHING',
    [cacheKey, JSON.stringify(result)]
  );

  return result;
}

function buildPrompt({ ingredients, expiringIngredients, preferences }: RecipeRecommendInput): string {
  return `
너는 냉장고 기반 요리 추천 AI다.

[사용자가 가진 재료]
${ingredients.join(', ')}

[곧 상하는 재료]
${expiringIngredients.join(', ')}

[요구사항]
- 가능한 요리 3개 추천
- 반드시 "곧 상하는 재료"를 우선 사용
- 부족한 재료는 missingIngredients에 명시
- 현실적인 요리만 (한국 가정식 위주)
- 난이도: ${preferences?.difficulty ?? 'easy'}

[출력 형식 - JSON ONLY]
{
  "recipes": [
    {
      "name": "",
      "description": "",
      "ingredients": [],
      "missingIngredients": [],
      "steps": [],
      "score": 0.0
    }
  ]
}

JSON 외 텍스트 절대 금지
  `.trim();
}
