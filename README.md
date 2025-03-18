# Image 컴포넌트

- https://nextjs.org/docs/pages/api-reference/components/image
- https://velog.io/@apparatus1/next-image
- webp, AVIF 등의 이미지 포맷으로 자동 변환을 지원
- 디바이스에 맞도록 이미지를 생성해서 적용 지원
- Lazy Loading 등도 지원
- Blur 효과로 이미지를 사전에 흐린 이미지로 로딩 후 완료 시 선명한 이미지로 대체

## 외부 URL 이미지 활용하기

- next.config.ts

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
    ],
  },
};

export default nextConfig;
```

## Image 컴포넌트 사용법

```tsx
import Image from "next/image";
<Image src={경로} width={너비} height={높이} alt={이미지설명} />;
```

# SEO 적용하기

- 메타 데이터 설정을 통해 진행

## 실습

- favicon.ico는 /src/app 폴더에 배치
- /src/app/(with-search)/page.tsx 적용

```tsx
import style from "@/app/(with-search)/page.module.css";
import AllGoods from "@/components/all-goods";
import RandomGoods from "@/components/random-goods";
import GoodItemSkeletonList from "@/components/skeleton/good-item-skeleton-list";
import { Metadata } from "next";
import { Suspense } from "react";

// 강제로 Dynamic으로 변경하는 방법
// next에서는 page를 강제로 변경하는 방법 제공
// export const dynamic = "auto";
export const dynamic = "force-dynamic";

// SEO 적용
export const metadata: Metadata = {
  title: "상품 홍보 페이지",
  description: "상품 홍보 페이지입니다.",
  openGraph: {
    title: "상품 홍보 페이지",
    description: "상품 홍보 페이지입니다.",
    images: [{ url: "/thumbnail.png" }],
  },
};

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

- /src/app/(with-search)/search/page.tsx 적용

```tsx
import styles from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/good-item";
import { GoodDataType } from "@/types/types";
import { Metadata } from "next";
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

// SEO 적용
// export const metadata: Metadata = {
//   title: "상품 검색 페이지",
//   description: "상품 검색 페이지입니다.",
//   openGraph: {
//     title: "상품 검색 페이지",
//     description: "상품 검색 페이지입니다.",
//     images: [{ url: "/thumbnail.png" }],
//   },
// };

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) => {
  const { keyword } = await searchParams;
  return {
    title: `상품 ${keyword} 검색 페이지`,
    description: `상품 ${keyword} 검색 페이지입니다.`,
    openGraph: {
      title: `상품 ${keyword} 검색 페이지`,
      description: `상품 ${keyword} 검색 페이지입니다.`,
      images: [{ url: "/thumbnail.png" }],
    },
  };
};

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

- /src/app/good/[id]/page.tsx

```tsx
import styles from "@/app/good/[id]/page.module.css";
import CateList from "@/components/cate-list";
import Editor from "@/components/editor";
import { GoodDataType } from "@/types/types";
import Image from "next/image";
import { notFound } from "next/navigation";

// 특정한 페이지를 Static Page 로 생성
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

// 상세화면 컴포넌트
async function Detail({ id }: { id: string }) {
  let good: GoodDataType | null = null;
  try {
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    //   {
    //     cache: "force-cache",
    //   }
    // );
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        next: { tags: [`good-${id}`] },
      }
    );
    good = await res.json();
    // console.log(good);
  } catch (error) {
    console.log(error);
  }

  if (!good) {
    // 404 띄우기
    notFound();
    // return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${image})` }}
      >
        <Image src={image} width={245} height={350} alt={title} />
      </div>
      <div className={styles.category}>{category}</div>
      <div className={styles.rating}>
        Rating: {rating.rate} | {rating.count}
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}

// SEO
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );
    const good: GoodDataType = await res.json();
    const { title, description, image } = good;

    return {
      title: `상품 ${title} 상세 페이지`,
      description: `상품 설명 - ${description}`,
      openGraph: {
        title: `상품 ${title} 상세 페이지`,
        description: `상품 설명 - ${description}`,
        images: [{ url: image }],
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log(id);

  return (
    <div>
      <Detail id={id} />
      <Editor />
      <CateList id={id} />
    </div>
  );
}
```

# Deploy 실행하기(Vercel)

- `npm run build`로 오류 발견 시 제거 및 수정
