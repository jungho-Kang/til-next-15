"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      {/* <button onClick={() => reset()}>다시 시도</button> */}
      {/* <button onClick={() => window.location.reload()}>다시 시도</button> */}
      <button
        onClick={() => {
          // React 18 버전에 추가된 기능
          startTransition(() => {
            router.refresh(); // 서버 컴포넌트 다시 실행하기를 요청
            reset(); // 컴포넌트 새로고침
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
