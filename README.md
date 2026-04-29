# food-storage-back

냉장고 재료 기반 레시피 추천 앱의 백엔드 서버입니다.

## 기술 스택

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL (Render)
- **Auth**: Firebase Admin SDK
- **AI**: OpenAI GPT-4o-mini

## 프로젝트 구조

```
src/
├── config/
│   ├── db.ts          # PostgreSQL 연결 설정
│   └── firebase.ts    # Firebase Admin 초기화
├── controllers/
│   └── recipeController.ts
├── middlewares/
│   └── auth.ts        # Firebase JWT 인증
├── routes/
│   └── recipeRoutes.ts
├── services/
│   ├── openaiService.ts
│   └── recipeService.ts
├── types/
│   └── express.d.ts   # req.user 타입 확장
├── app.ts
└── index.ts
sql/
└── init.sql           # DB 스키마
```

## API

모든 엔드포인트는 `Authorization: Bearer <Firebase ID Token>` 헤더 필요.

| Method | Path | 설명 |
|--------|------|------|
| GET | `/health` | 헬스체크 |
| GET | `/recipes` | 내 레시피 목록 조회 |
| POST | `/recipes` | 레시피 저장 |
| POST | `/recipes/ai-recommend` | AI 레시피 추천 |

### POST /recipes/ai-recommend

```json
{
  "ingredients": ["달걀", "두부", "대파"],
  "expiringIngredients": ["두부"],
  "preferences": { "difficulty": "easy" }
}
```

## 로컬 개발 환경 설정

### 1. 환경변수 설정 (`.env`)

```env
OPENAI_API_KEY=...
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_storage
DB_USER=postgres
DB_PASSWORD=
PORT=3000
```

### 2. PostgreSQL 시작 및 DB 초기화

```bash
brew services start postgresql@14
createdb food_storage
psql -d food_storage -f sql/init.sql
```

### 3. 서버 실행

```bash
npm run dev
```

## 배포 (Render)

### 환경변수 설정

| 변수명 | 설명 |
|--------|------|
| `DATABASE_URL` | Render PostgreSQL External URL |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase 서비스 계정 JSON 문자열 |
| `OPENAI_API_KEY` | OpenAI API 키 |

### DB 스키마 초기화 (최초 1회)

```bash
psql "$DATABASE_URL" -f sql/init.sql
```

### 헬스체크 경로

Render 헬스체크는 `GET /health` 로 설정.
