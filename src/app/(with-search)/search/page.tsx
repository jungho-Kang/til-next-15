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
