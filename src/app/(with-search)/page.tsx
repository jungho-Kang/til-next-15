import goods from "@/mock/good.json";
import styles from "@/app/(with-search)/page.module.css";
import GoodItem from "@/components/good-item";
export default function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        {goods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </section>
      <section>
        <h3>전체 상품</h3>
        {goods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </section>
    </div>
  );
}
