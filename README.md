# Loading

- page 출력 시 오래 걸리는 작업인 경우에 loading을 표현한다
- Dynamic Page에 활용한다
- 즉, 비동기 화면에 적용한다

## Next.js에서 제공하는 loading.tsx가 있다

- page에만 적용된다
- 파일명은 약속되어 있다

## 컴포넌트에서 loading을 처리하려면 Suspense를 활용

- 세밀하게 loading 처리할 때

## Page에 로딩처리

- Dynamic Page에 적용된다
- 비동기로서 async 화면에 적용된다

- /src/app/(with-search)/search/loading.tsx 생성
- http://localhost:3000/search?keyword=jewelery
- http://localhost:3000/search?keyword=electronics

```tsx
export default function Loading() {
  return <div>검색 결과 데이터 로딩중...</div>;
}
```

### 주의 사항

- 라우터 경로 하부는 무조건 위에 정의한 loading.tsx만 사용한다
- 각 라우터마다 loading.tsx를 설정하지 않으면 공통으로 사용한다
- 특정 컴포넌트에 로딩을 걸어주는 것은 안된다

## 컴포넌트에 세밀한 로딩처리

- React의 `Suspense 컴포넌트`로 처리
- loading.tsx 제거
- `http://localhost:3000/search?keyword=jewelery`
- /src/app/(with-search)/search/page.tsx 수정

```tsx
import styles from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/good-item";
import { GoodDataType } from "@/types/types";
import { Suspense } from "react";

async function SearchResult({ keyword }: { keyword: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${keyword}`
  );
  const goods: GoodDataType[] = await res.json();
  if (goods.length === 0) {
    return <div>{keyword} 카테고리에 해당하는 제품이 없습니다.</div>;
  }
  return (
    <div>
      {" "}
      {goods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;
  // console.log(keyword);
  // 아래의 작업이 오래 걸린다면
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${keyword}`
  );
  const goods: GoodDataType[] = await res.json();
  if (goods.length === 0) {
    return <div>{keyword} 카테고리에 해당하는 제품이 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h4>
        카테고리명 : <strong>{keyword}</strong> - 검색페이지
      </h4>
      <Suspense
        fallback={
          <div>
            <strong>{keyword}</strong> 검색결과 로딩중...
          </div>
        }
      >
        <SearchResult keyword={keyword} />
      </Suspense>
    </div>
  );
}
```

- /src/components/all-goods.tsx 에서 데이터 캐시 제거
- /src/components/random-goods.tsx 에서 데이터 캐시 제거
- /src/app/(with-search)/page.tsx 수정

```tsx
import style from "@/app/(with-search)/page.module.css";
import AllGoods from "@/components/all-goods";
import RandomGoods from "@/components/random-goods";
import { Suspense } from "react";

// 강제로 Dynamic으로 변경하는 방법
// next에서는 page를 강제로 변경하는 방법 제공
// export const dynamic = "auto";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        <Suspense fallback={<div>추천상품 데이터 로딩중...</div>}>
          <RandomGoods />
        </Suspense>
      </section>
      <section>
        <h3>전체 상품</h3>
        <Suspense fallback={<div>전체상품 데이터 로딩중...</div>}>
          <AllGoods />
        </Suspense>
      </section>
    </div>
  );
}
```

## 스켈레톤 UI 적용하기

- `/src/components/skeleton` 폴더 생성
- /src/components/skeleton/good-item-skeleton.tsx 파일 생성

```tsx
import styles from "@/components/skeleton/good-item-skeleton.module.css";
export default function GoodItemSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.image}></div>
      <div className={styles.box}>
        <div className={styles.title}></div>
        <div className={styles.category}></div>
        <br />
        <div className={styles.rating}></div>
      </div>
    </div>
  );
}
```

- /src/components/skeleton/good-item-skeleton.module.css 파일 생성

```css
.container {
  display: flex;
  gap: 15px;
  padding: 20px 10px;
  border-bottom: 1px solid rgb(220, 220, 220);
  color: #333;
  text-decoration: none;
  height: 155px;
}
.image {
  min-width: 80px;
  width: 80px;
  height: 115px;
  background-color: rgb(220, 220, 220);
}
.box {
  flex: 1;
}
.title {
  width: 70%;
  height: 25px;
  background-color: rgb(220, 220, 220);
  margin-bottom: 10px;
}
.category {
  background-color: rgb(220, 220, 220);
  height: 20px;
  width: 20%;
}
.rating {
  background-color: rgb(220, 220, 220);
  width: 25%;
  height: 21px;
}
```

### 개수를 조금 더 편하게 처리하기

- /src/components/skeleton/good-item-skeleton-list.tsx 생성

```tsx
import GoodItemSkeleton from "./good-item-skeleton";

export default function GoodItemSkeletonList({ count }: { count: number }) {
  // 모든 요소를 0으로 초기화
  const arr = new Array(count).fill(0);
  return (
    <>
      {arr.map((_, index) => (
        <GoodItemSkeleton key={index} />
      ))}
      {/* {[...Array(count)].map((_, index) => {
        const startIndex = index + 1;
        return <GoodItemSkeleton key={startIndex} />;
      })} */}
    </>
  );
}
```

- /src/app/(with-search)/page.tsx

```tsx
import style from "@/app/(with-search)/page.module.css";
import AllGoods from "@/components/all-goods";
import RandomGoods from "@/components/random-goods";
import GoodItemSkeletonList from "@/components/skeleton/good-item-skeleton-list";
import { Suspense } from "react";

// 강제로 Dynamic으로 변경하는 방법
// next에서는 page를 강제로 변경하는 방법 제공
// export const dynamic = "auto";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        <Suspense fallback={<GoodItemSkeletonList count={3} />}>
          <RandomGoods />
        </Suspense>
      </section>
      <section>
        <h3>전체 상품</h3>
        <Suspense fallback={<GoodItemSkeletonList count={5} />}>
          <AllGoods />
        </Suspense>
      </section>
    </div>
  );
}
```

- 라이브러리 : https://github.com/dvtng/react-loading-skeleton#readme
