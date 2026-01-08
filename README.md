# est_project

이 프로젝트는 `backend`와 `frontend`가 분리되어 있습니다. 각각의 터미널에서 실행해야 합니다.

### 사전 요구사항 (Prerequisites)

- Node.js (v24 이상 권장)
- PostgreSQL Server (v16)
- Redis (v5)

### 1. 레포지토리 클론 (Clone)

```bash
git clone https://github.com/TaeeunKuk/est_project.git
cd est_project
```

### 2. 백엔드 설정 (Backend Setup)

1. **디렉토리 이동 및 패키지 설치**

```bash
cd backend
npm install
```

2. **환경 변수 설정 (.env)**
   `backend` 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 입력하세요.

```env
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
```

3. **실행**

```bash
# 개발 모드 실행
npm run dev
```

### 3. 프론트엔드 설정 (Frontend Setup)

```bash
cd frontend
npm install
npm run dev
```
