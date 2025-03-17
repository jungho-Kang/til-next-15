# Next App Router의 Server Action

## 일반적인 API 통신

- 단계 1 : 웹 브라우저에서 **백엔드 서버(BE)** 로 호출하는 비동기 함수
- 단계 2 : 백엔드 서버에서 **DB로부터 자료 조회 및 처리**
- 단계 3 : 백엔드 서버에서 **웹 브라우저로 응답 반환**
- 단계 4 : 프론트엔드(FE)에서 **화면 처리 및 출력**

## Next `Server Action`

- 단계 1 : 웹 브라우저에서 **Next 서버로 호출하는 비동기 함수**
- 단계 2 : Next.js 서버에서 **DB에 직접 접근하여 자료 조회 및 처리**
- 단계 3 : 프론트엔드(FE)에서 **즉시 화면 출력**

## 샘플 코드

```tsx
export default function Page() {
  const 서버액션 = async (formData: FormData) => {
    "use server";

    const nickName = formData.get("nickname");

    // awiat 서버기능호출(nickName)
    // await sql`INSERT INTO NickName (nickname) VALUES (${nickName})`;
  };

  return (
    <>
      <form action={서버액션}>
        <input type="text" name="nickname" />
        <button type="submit">입력</button>
      </form>
    </>
  );
}
```

## 액션 코드 적용

- /src/app/good/[id]/page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import styles from "@/app/good/[id]/page.module.css";
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "force-cache",
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
function Editor() {
  async function createReviewAction(formData: FormData) {
    "use server";
    console.log("서버에서 처리");
    const content = formData.get("content");
    const author = formData.get("author");
    console.log(content);
    console.log(author);
  }
  return (
    <div>
      <form action={createReviewAction}>
        <input type="text" name="content" placeholder="리뷰내용" />
        <input type="text" name="author" placeholder="작성자" />
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}

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
    </div>
  );
}
```

## 활용하기

```tsx
function Editor() {
  async function createReviewAction(formData: FormData) {
    "use server";
    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString();
    const price = formData.get("price")?.toString();
    const description = formData.get("description")?.toString();
    const image = formData.get("image")?.toString();
    const category = formData.get("category")?.toString();

    console.log(
      "Next 서버 액션 전달 변수 : ",
      id,
      title,
      price,
      description,
      image,
      category
    );
    // 값이 없으면 리턴
    if (!id || !title || !price || !description || !image || !category) {
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        body: JSON.stringify({
          title,
          price,
          description,
          image,
          category,
        }),
      });
      const { id } = await res.json();
      console.log("상품 등록 성공", id);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <form action={createReviewAction}>
        <input type="hidden" name="id" value={500} readOnly />
        <input
          type="text"
          name="title"
          placeholder="상품명"
          required
          defaultValue={"test product"}
        />
        <input
          type="text"
          name="price"
          placeholder="가격"
          required
          defaultValue={"13.5"}
        />
        <input
          type="text"
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <input
          type="text"
          name="image"
          placeholder="이미지"
          required
          defaultValue={"https://i.pravatar.cc/"}
        />
        <input
          type="text"
          name="category"
          placeholder="카테고리"
          required
          defaultValue={"category"}
        />
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}
```

## 액션들은 관례상 별도로 분리해서 작성합니다

- `/src/actions` 폴더 생성
- `/src/actions/create-review-action.ts` 파일 생성

```ts
"use server";
export async function createReviewAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();

  console.log(
    "Next 서버 액션 전달 변수 : ",
    id,
    title,
    price,
    description,
    image,
    category
  );
  // 값이 없으면 리턴
  if (!id || !title || !price || !description || !image || !category) {
    return;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        title,
        price,
        description,
        image,
        category,
      }),
    });
    const { id } = await res.json();
    console.log("상품 등록 성공", id);
  } catch (error) {
    console.log(error);
  }
}
```

## 컴포넌트로 추출 후 CSS 작업

- `/src/components/editor.tsx` 생성

```tsx
import { createReviewAction } from "@/actions/create-review-action";
import styles from "@/components/editor.module.css";

export default function Editor() {
  return (
    <div className={styles.add_container}>
      <h3>제품 추가하기</h3>
      <form action={createReviewAction} className={styles.form_container}>
        <input type="hidden" name="id" value={500} readOnly />
        <div className={styles.input_container}>
          <input
            type="text"
            name="title"
            placeholder="상품명"
            required
            defaultValue={"test product"}
          />
          <input
            type="text"
            name="price"
            placeholder="가격"
            required
            defaultValue={"13.5"}
          />
        </div>
        <textarea
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <div className={styles.input_container}>
          <input
            type="text"
            name="image"
            placeholder="이미지"
            required
            defaultValue={"https://i.pravatar.cc/"}
          />
          <input
            type="text"
            name="category"
            placeholder="카테고리"
            required
            defaultValue={"category"}
          />
        </div>
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}
```

- `/src/components/editor.module.css` 생성

```css
.add_container {
  display: flex;
  flex-direction: column;
}
.form_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form_container textarea {
  width: 100%;
  height: 100px;
  resize: vertical;
}
.input_container {
  display: flex;
  gap: 5px;
}
.input_container input {
  padding: 10px;
  border: 1px solid rgb(220, 220, 220);
  border-radius: 5px;
  width: 50%;
}
.form_container button {
  padding: 10px;
  border: 1px solid rgb(220, 220, 220);
  border-radius: 5px;
  background-color: rgb(37, 147, 255);
  color: #fff;
  cursor: pointer;
}
```

## 카테고리 해당 상품 출력하기

- /src/components/cate-list.tsx 생성

```tsx
import styles from "@/components/cate-list.module.css";
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";
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
          <GoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
```

- /src/components/cate-list.module.css 생성

```css
.cate_container {
  display: flex;
  flex-direction: column;
}
.cate_container strong {
  color: yellowgreen;
}
```

- /src/app/good/[id]/page.tsx

```tsx
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "force-cache",
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
```

# 새로운 데이터가 처리 되었을 때 리렌더링하기

- Static Page로 데이터 패칭, 데이터 캐싱을 하였다
- Static된 내용을 새로 렌더링 하도록 요청하는 방법

## 주의사항

- `오직 서버에서만` 호출 가능
- 클라이언트에서 요청을 해도 화면이 리렌더링 되어서 새로운 내용 출력 못함
- 함수명이 고정되어 있다
- `revalidatePath(인자)`

## `revalidatePath 방식 4가지`

- 특정 페이지만 내용 갱신 : revalidatePath(`/gooo/${id}`)
- 특정 경로의 모든 동적 페이지 내용 갱신 : revalidatePath(`/gooo/[id]`, "page" )
- 특정 레이아웃을 갖는 모든 페이지 내용 갱신 : revalidatePath(`/(with-search)`, "layout")
- 전체 내용을 갱신 : revalidatePath(`/`, "layout")

## `revalidateTag 방식`

- 특정 태그 값을 기준으로 데이터 내용 갱신 : revalidateTag(`good-${id}`)

```tsx
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
  // cache: "force-cache",
  next: { tags: [`good-${id}`] },
});
```

- 데이터 갱신 실행
- /src/actions/create-review-action.ts

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createReviewAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();

  console.log(
    "Next 서버 액션 전달 변수 : ",
    id,
    title,
    price,
    description,
    image,
    category
  );
  // 값이 없으면 리턴
  if (!id || !title || !price || !description || !image || !category) {
    return;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        title,
        price,
        description,
        image,
        category,
      }),
    });
    const { id } = await res.json();
    console.log("상품 등록 성공", id);

    // 태그를 이용하는 경우
    revalidateTag(`good-${id}`);

    // 패스를 이용하는 경우
    revalidatePath(`/good/${id}`);
  } catch (error) {
    console.log(error);
  }
}
```

## 클라이언트 컴포넌트에서 서버액션 호출 시 제어하기

- 서버액션 호출 시 로딩 상태, 에러 상태를 제어하고 싶다

## 실습

- /src/actions/create-review-action.ts 파일 수정

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

// 액션의 상태도 전달하는 형태로 변경하기
// export async function createReviewAction(state: any, formData: FormData) {
export async function createReviewAction(_: any, formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();

  console.log(
    "Next 서버 액션 전달 변수 : ",
    id,
    title,
    price,
    description,
    image,
    category
  );
  // 값이 없으면 리턴
  if (!id || !title || !price || !description || !image || !category) {
    return {
      status: false,
      message: "각 항목을 채워주세요.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        title,
        price,
        description,
        image,
        category,
      }),
    });
    const { id } = await res.json();
    // console.log("상품 등록 성공", id);

    // 태그를 이용하는 경우
    revalidateTag(`good-${id}`);

    // 패스를 이용하는 경우
    // revalidatePath(`/good/${id}`);
    return {
      status: true,
      message: "등록에 성공하였습니다.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: `새로운 상품 등록에 실패하였습니다. ${error}`,
    };
  }
}
```

- /src/components/editor.tsx를 클라이언트로 변경

```tsx
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
```

## 삭제하기 기능을 통한 서버액션 및 컴포넌트 복습

- [requestSubmit](<https://www.devdic.com/javascript/reference/dom/method:2766/requestSubmit()>)

### 1. 서버액션 만들기

- /src/actions/delete-action.ts

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteAction(_: any, formData: FormData) {
  const goodId = formData.get("goodid") as string;
  if (!goodId) {
    return {
      status: false,
      message: `제품번호 ${goodId}번이 없습니다.`,
    };
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${goodId}`,
      {
        method: "DELETE",
      }
    );
    const { id } = await res.json();

    revalidatePath(`/good/${goodId}`);
    revalidateTag(`good-${goodId}`);

    return {
      status: true,
      message: `제품번호 ${goodId}번 삭제에 성공하였습니다.`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: `제품번호 ${goodId}번 삭제에 실패했습니다. 다시 시도해주세요.`,
    };
  }
}
```

- /src/components/delete-bt.tsx

```tsx
"use client";
import { deleteAction } from "@/actions/delete-action";
import styles from "@/components/delete-bt.module.css";
import { useActionState, useEffect, useRef } from "react";

export default function DeleteBt({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(deleteAction, null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.status) {
      alert(state.message);
    }
  }, [state]);

  return (
    <>
      <form action={formAction} className={styles.container} ref={formRef}>
        <input type="hidden" name="goodid" value={id} readOnly hidden />
        {isPending ? (
          <div className={styles.delete_btn}>Deleting...</div>
        ) : (
          <div
            className={styles.delete_btn}
            onClick={() => formRef.current?.requestSubmit()}
          >
            Delete
          </div>
        )}
      </form>
    </>
  );
}
```

- /src/components/delete-bt.module.css

```css
.container {
  position: relative;
  margin-top: 10px;
}
.delete_btn {
  position: absolute;
  right: 0;
  top: -50px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid rgb(220, 220, 220);
}
```
