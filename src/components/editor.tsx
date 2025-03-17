"use client";
import { createReviewAction } from "@/actions/create-review-action";
import styles from "@/components/editor.module.css";
import { useActionState, useEffect } from "react";

export default function Editor() {
  // React 19 버전부터 적용가능
  // 서버액션의 상태를 파악해서 클라이언트에서 활용하는 방식
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  // state가 변경되면 실행하기
  useEffect(() => {
    if (state && !state.status) {
      alert(state.message);
    }
  }, [state]);

  // 서버액션이 진행중..
  if (isPending) {
    return <div>서버액션 진행중 ...</div>;
  }

  // 서버액션의 결과에서 status가 false라면
  if (state?.status === false) {
    return <p>{state.message}</p>;
  }

  return (
    <div className={styles.add_container}>
      <h3>제품 추가하기</h3>
      <form action={formAction} className={styles.form_container}>
        <input type="hidden" name="id" value={500} readOnly />
        <div className={styles.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="title"
            placeholder="상품명"
            required
            defaultValue={"test product"}
          />
          <input
            disabled={isPending}
            type="text"
            name="price"
            placeholder="가격"
            required
            defaultValue={"13.5"}
          />
        </div>
        <textarea
          disabled={isPending}
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <div className={styles.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="image"
            placeholder="이미지"
            required
            defaultValue={"https://i.pravatar.cc/"}
          />
          <input
            disabled={isPending}
            type="text"
            name="category"
            placeholder="카테고리"
            required
            defaultValue={"category"}
          />
        </div>
        <button disabled={isPending} type="submit">
          {isPending ? "작성중.." : "작성하기"}
        </button>
      </form>
    </div>
  );
}
