import styles from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/good-item";
import goods from "@/mock/good.json";
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
  return (
    <div className={styles.container}>
      <h4>
        <strong>{keyword}</strong> : 검색페이지
      </h4>
      <div>
        {goods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </div>
    </div>
  );
}
