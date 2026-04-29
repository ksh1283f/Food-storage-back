import OpenAI from 'openai';

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

export async function getAIRecipes(
  input: RecipeRecommendInput
): Promise<RecipeRecommendResult> {
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
  return JSON.parse(text) as RecipeRecommendResult;
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
