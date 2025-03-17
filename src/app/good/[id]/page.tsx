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

// 사용자 평가 입력 컴포넌트
// 서버액션 처리

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
