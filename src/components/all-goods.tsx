import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export default async function AllGoods() {
  let allGoods: GoodDataType[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`,
      { next: { revalidate: 10 } }
    );
    allGoods = await res.json();
  } catch (error) {
    console.log(error);
  }
  return (
    <>
      {allGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
