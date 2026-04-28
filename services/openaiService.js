import openAI from 'openai';

const client = new openAI.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIRecipes({
    ingredients,
    expiringIngredients,
    preferences,
}) {
    const prompt = buildPrompt({
        ingredients,
        expiringIngredients,
        preferences
    });

    const response = await client.chat.completions.create({
        model: "gpt-5-mini",
        messages:[{
                role:"system", 
                content: "You are a professional chef AI.",
            },
            {
                role:"user",
                content: prompt,
            }
        ],
        temperature: 0.7,
    });

    const text = response.choices[0].message.content;

    return JSON.parse(text);
}

function buildPrompt({ ingredients, expiringIngredients, preferences }) {
    return `
        너는 냉장고 기반 요리 추천 AI다.

        [사용자가 가진 재료]
        ${ingredients.join(", ")}

        [곧 상하는 재료]
        ${expiringIngredients.join(", ")}

        [요구사항]
        - 가능한 요리 3개 추천
        - 반드시 "곧 상하는 재료"를 우선 사용
        - 부족한 재료는 missingIngredients에 명시
        - 현실적인 요리만 (한국 가정식 위주)
        - 난이도: ${preferences?.difficulty || "easy"}

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
    `;
}