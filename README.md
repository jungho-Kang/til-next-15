# Next 15 App Router

- til-next-14에서 내용 확인하기

```
- CSR의 장단점
- SSR의 장단점
- SSG의 장단점
- ISR의 장단점
```

## 프로젝트 생성

- 현재 폴더에 프로젝트 생성

```bash
npx create-next-app@latest .
```

- 지금은 tailwind는 설치하지 않음
  ![Image](https://github.com/user-attachments/assets/612b822f-1ffc-48f8-a723-83a0522486dc)
- 테스트 해보기
  - `npm run dev` : 개발모드로 실행
  - `npm run build` : 빌드진행
  - `npm run start` : Production 모드로 실행

## Pages Router 복습

- til-next-14에서 **Pages Router**를 리뷰하기
  - /src/pages/라우터명.tsx
  - /src/pages/board/[id].tsx 등등

## App Router

- `/src/app` 폴더가 기준

### 1. URI의 일반 경로 처리

- http://localhost:3000/
  - `/src/app/page.tsx` 기준

```tsx
import styles from "./page.module.css";

export default function Home() {
  return <div className={styles.page}>인덱스페이지</div>;
}
```

### 2. URI의 쿼리(`query`) 처리

- http://localhost:3000/search
  - `/src/app/search/page.tsx`

```tsx
export default function Page() {
  return <div>검색페이지</div>;
}
```

- http://localhost:3000/search?keyword=iu
  - `쿼리 전달`

```tsx
// 쿼리 처리하기
// 아래 페이지는 쿼리를 서버에서 읽어들여서 처리함
// http://localhost:3000/search?keyword=iu

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;
  console.log(keyword);
  return <div>{keyword} : 검색페이지</div>;
}
```

- 기본적으로 Next에서는 `서버컴포넌트`가 됨
- console.log 실행 시 터미널(서버)에서 출력됨
  ![Image](https://github.com/user-attachments/assets/0fb50e11-b0de-4f7a-8c37-660e1404fd9f)
- 개발 중일 때만 F12번 콘솔창에 출력됨 (Server 키워드 출력)
  ![Image](https://github.com/user-attachments/assets/35f0b289-628e-43b4-985b-0241a2adbcac)

### 3. URI의 `Params` 처리

- http://localhost:3000/good
  - `/src/app/good/page.tsx`

```tsx
export default function Page() {
  return <div>제품페이지</div>;
}
```

- http://localhost:3000/good/1
  - `/src/app/good/1/page.tsx`
- http://localhost:3000/good/2
  - `/src/app/good/2/page.tsx`
- 위의 경우는 라우터가 동적으로 변경됨

  - `/src/app/good/[id]/page.tsx`

  ![Image](https://github.com/user-attachments/assets/8524a81b-b1e6-4071-b24a-66189aafb09e)
  ![Image](https://github.com/user-attachments/assets/81bc30c4-e9a6-4d18-9a75-60ea9ee29920)

- http://localhost:3000/good/2/5/800 (중첩된 경우)

  - `/src/app/good/[...id]/page.tsx`

  ![Image](https://github.com/user-attachments/assets/9c80d22e-fb7e-4bfe-b296-51a58595c99c)
  ![Image](https://github.com/user-attachments/assets/46395908-d832-4d3e-ba3c-2a13e1afacdb)

### 4. URI의 없는 경로(`404 페이지`) 처리

- http://localhost:3000/gogo (없는 경로)
  - `/src/app/not-found.tsx`

```tsx
export default function NotFound() {
  return <div>잘못된 경로 입니다.</div>;
}
```

- 추후에 테스트 해보기
  - http://localhost:3000/search/gogo (없는 경로)
  - `/src/app/search/not-found.tsx`
