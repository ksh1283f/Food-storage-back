import 'dotenv/config';
import { getAIRecipes } from '../services/openaiService';

const COMBINATIONS = [
  {
    label: '시금치/콩나물/계란',
    ingredients: ['시금치', '콩나물', '계란', '마늘', '대파', '참기름', '간장'],
    expiringIngredients: ['시금치', '콩나물'],
  },
  {
    label: '감자/애호박/두부',
    ingredients: ['감자', '애호박', '두부', '마늘', '양파', '간장', '고추장'],
    expiringIngredients: ['애호박', '두부'],
  },
  {
    label: '돼지고기/배추/무',
    ingredients: ['돼지고기', '배추', '무', '마늘', '대파', '된장', '고추장'],
    expiringIngredients: ['돼지고기', '배추'],
  },
  {
    label: '계란/당근/오이',
    ingredients: ['계란', '당근', '오이', '마늘', '참기름', '간장', '설탕'],
    expiringIngredients: ['오이', '당근'],
  },
  {
    label: '닭고기/감자/양파',
    ingredients: ['닭고기', '감자', '양파', '마늘', '대파', '간장', '고추장'],
    expiringIngredients: ['닭고기', '감자'],
  },
  {
    label: '소고기/무/당근',
    ingredients: ['소고기', '무', '당근', '마늘', '양파', '간장', '참기름'],
    expiringIngredients: ['소고기', '무'],
  },
  {
    label: '두부/김치/돼지고기',
    ingredients: ['두부', '김치', '돼지고기', '마늘', '대파', '참기름', '간장'],
    expiringIngredients: ['두부', '김치'],
  },
  {
    label: '멸치/깻잎/부추',
    ingredients: ['멸치', '깻잎', '부추', '마늘', '간장', '설탕', '참기름'],
    expiringIngredients: ['깻잎', '부추'],
  },
];

async function main() {
  console.log(`총 ${COMBINATIONS.length}개 조합 캐시 생성 시작\n`);

  for (const combo of COMBINATIONS) {
    process.stdout.write(`[${combo.label}] 요청 중...`);
    try {
      const result = await getAIRecipes({
        ingredients: combo.ingredients,
        expiringIngredients: combo.expiringIngredients,
        preferences: { difficulty: 'easy' },
      });
      console.log(` 완료 (레시피 ${result.recipes.length}개)`);
    } catch (err) {
      console.log(` 실패: ${err}`);
    }
  }

  console.log('\n캐시 생성 완료');
  process.exit(0);
}

main();
