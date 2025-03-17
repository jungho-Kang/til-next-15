import styles from "@/components/cate-list.module.css";
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";
import DeleteBt from "./delete-bt";
export default async function CateList({ id }: { id: string }) {
  // 같은 호출이 여러번 일어나도 NEXT에서는 한번만 호출이 된다
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  const good: GoodDataType = await res.json();
  const { category } = good;
  const resCate = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${category}`
  );
  const goods: GoodDataType[] = await resCate.json();

  return (
    <div className={styles.cate_container}>
      <h3>
        <strong>{category}</strong> 상품 목록
      </h3>
      <div>
        {goods.map((item) => (
          <div key={item.id}>
            <GoodItem key={item.id} {...item} />
            <DeleteBt id={item.id.toString()} />
          </div>
        ))}
      </div>
    </div>
  );
}
