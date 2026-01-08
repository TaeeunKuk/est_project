# est_project

---

## 1. 설치 및 실행 방법 (Getting Started)

이 프로젝트는 backend와 frontend가 분리되어 있습니다. 각각의 터미널에서 실행해야 합니다.

### 사전 요구사항 (Prerequisites)

- Node.js (v24 이상 권장)
- PostgreSQL Server (v16)
- Redis (v5)

### 1-1. 레포지토리 클론 (Clone)

```bash
git clone https://github.com/TaeeunKuk/est_project.git
cd est_project

```

### 1-2. 백엔드 설정 (Backend Setup)

1. 디렉토리 이동 및 패키지 설치

```bash
cd backend
npm install

```

2. 환경 변수 설정 (.env)
   backend 루트 디렉토리에 .env 파일을 생성하고 다음 내용을 입력하세요.

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

3. 실행

```bash
# 개발 모드 실행
npm run dev

```

### 1-3. 프론트엔드 설정 (Frontend Setup)

```bash
cd frontend
npm install
npm run dev

```

---

## 2. ERD 및 테이블 설계 설명

<img width="997" height="645" alt="ERD 다이어그램" src="https://github.com/user-attachments/assets/d4f1ae9d-2208-4796-95ed-ea9e5814143b" />

### 2-1.

테이블 목록 및 개요

본 프로젝트는 회원 정보, 카테고리, 할 일을 관리하기 위해 총 3개의 테이블로 구성됩니다.

- **users (TB_USER)**: 서비스 이용자의 개인 정보 및 인증 데이터를 관리합니다.

- **categories (TB_CATEGORY)**: 사용자별 할 일을 분류하기 위한 카테고리 정보를 저장합니다.

- **todos (TB_TODO)**: 사용자의 개별 할 일 기록 및 일정 데이터를 통합하여 관리합니다.

### 2-2.

테이블별 설계 상세

1. 회원 정보 (users)

사용자를 식별하고 안전하게 인증하기 위한 최소 정보를 관리합니다.

- **식별자 및 보안**: 이메일(email)은 UNIQUE 제약 조건을 설정하여 중복 가입을 방지하는 식별자로 활용하며, 비밀번호(password)는 보안을 위해 255자 길이를 확보하여 암호화된 해시값 저장에 대비하였습니다.

- **데이터 구성**: 사용자 ID(PK), 이름, 가입일 및 수정일 정보를 포함합니다.

2. 카테고리 (categories)

사용자별로 고유한 카테고리를 생성하고 할 일을 분류할 수 있도록 설계되었습니다.

- **소유권 및 무결성**: 사용자 삭제 시 관련 카테고리도 자동 삭제되도록 ON DELETE CASCADE 정책을 적용하였습니다.

- **중복 방지 제약**: 동일 사용자가 같은 이름의 카테고리를 중복 생성하는 것을 방지하기 위해 `uq_user_category_name (user_id, name)` UNIQUE 제약 조건을 설정하였습니다.

- **시각화**: UI에서 할 일을 쉽게 구분할 수 있도록 색상(color) 정보 컬럼을 포함합니다.

3. 할 일 및 일정 (todos)

할 일 데이터에 날짜 정보를 포함하여 별도의 테이블 없이 일정 기능까지 수행하도록 통합 설계되었습니다.

- **연계 정책**: 카테고리 삭제 시에도 할 일 데이터는 유지되어 데이터 유실을 방지할 수 있도록 SET NULL 정책을 적용하였습니다.

- **상태 및 일정 관리**: 완료 여부(is_completed)를 Boolean 타입으로 관리하며, 날짜(date) 필드를 필수값(NOT NULL)으로 설정하여 일정 조회의 기준점으로 활용합니다.

### 2-3.

공통 설계 특징

- **이력 관리**: 모든 테이블에 created_at 및 updated_at 컬럼을 포함하여 데이터 추적성을 확보하였습니다.

- **무결성 강제**: 모든 테이블에 Primary Key를 지정하고 Foreign Key 관계를 명확히 정의하여 데이터 무결성을 유지합니다.

---

## 3. Redis 사용 방식 설명

### 3-1. 활용 목적: JWT Refresh Token 관리

본 프로젝트에서는 보안 강화 및 세션 관리를 위해 Redis를 도입하였습니다. 주요 목적은 **Refresh Token의 화이트리스트 관리**입니다.

### 3-2. 상세 활용 방식

- **토큰 저장 및 검증**: 사용자가 로그인 시 생성되는 Refresh Token을 Redis에 저장합니다. 이후 Access Token 만료 시, Redis에 저장된 Refresh Token과 사용자가 제시한 토큰을 대조하여 검증을 통과한 경우에만 Access Token을 재발급합니다.
- **보안성 확보**: Refresh Token 탈취 시도를 방지하기 위해 Redis의 TTL(Time-To-Live) 기능을 활용하여 토큰 유효 기간이 지나면 자동으로 삭제되도록 설정하였습니다.
- **로그아웃 처리**: 로그아웃 시 Redis 내 해당 유저의 Refresh Token을 즉시 삭제함으로써, 탈취된 토큰이 재사용될 가능성을 차단합니다.

---

## 4. 주요 설계 판단 및 트레이드오프

### 4-1. 백엔드 4계층 구조 (Layered Architecture) 도입

- **결정**: Controller - Service - Model - Utils/Middleware 계층으로 로직을 분리하였습니다.
- **이유**: 프로젝트의 유지보수성과 확장성을 확보하기 위함입니다. 특히 인증 로직(authService)과 일반 유저 로직(userService)을 분리하여 각 도메인의 역할을 명확히 하였습니다.
- **트레이드오프**: 단순 CRUD 프로젝트에 비해 초기 코드 작성량이 많고 구조가 복잡해지나, 장기적인 코드 재사용성 측면에서 더 유리하다고 판단하였습니다.

### 4-2. 사용자 경험(UX) 중심의 레이아웃 설계

- **결정**: 캘린더를 왼쪽 사이드바에 좁게 배치하고, 오른쪽 영역에 할 일 리스트를 넓게 배치하였습니다.
- **이유**: 캘린더를 '정보 조회'의 목적보다는 날짜를 선택하는 **'네비게이터(Date Picker)'** 역할로 정의하였기 때문입니다. 할 일 데이터는 텍스트, 태그, 버튼 등 정보 밀도가 높으므로 넓은Action Area를 할당하여 사용성을 극대화하였습니다.

### 4-3. 회원가입 후 자동 로그인 처리

- **결정**: 회원가입 완료 시 로그인 페이지로 이동하는 대신, 토큰을 즉시 발급하여 대시보드로 자동 리다이렉트합니다.
- **이유**: 생산성 도구의 특성상 초기 사용자 이탈(Churn Rate)을 줄이기 위해 가입 즉시 서비스를 경험할 수 있도록 설계하였습니다.

### 4-4. SCSS 파셜(Partial) 구조 및 전역 스타일 통합

- **결정**: `_variables.scss`, `_mixins.scss` 등 파셜 파일을 활용하고, 전역 스타일을 `index.scss`로 통합하였습니다.
- **이유**: CSS와 SCSS가 분리될 경우 발생할 수 있는 스타일 우선순위 충돌을 방지하고, 변수 및 믹스인을 통한 코드 재사용성을 높이기 위함입니다.

---
