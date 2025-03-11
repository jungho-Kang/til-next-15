import { GoodDataType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/good-item.module.css";

const GoodItem = ({ id, title, image, category, rating }: GoodDataType) => {
  return (
    <Link href={`/good/${id}`} className={styles.container}>
      <Image src={image} width={80} height={115} alt={title} />
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.category}>{category}</div>
        <br />
        <div className={styles.rating}>
          Rating : {rating.rate} | {rating.count}
        </div>
      </div>
    </Link>
  );
};
export default GoodItem;
