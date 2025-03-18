/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";

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
    console.log(id);

    revalidatePath(`/good/${goodId}`);
    // revalidateTag(`good-${goodId}`);

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
