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
