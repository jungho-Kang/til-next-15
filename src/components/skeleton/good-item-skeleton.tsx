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
