import TextArea from "@/components/textarea";
import useCoords from "@/libs/client/useCoords";
import useMutation from "@/libs/client/useMutation";
import { Post } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");

  const onValid = (data: WriteForm) => {
    console.log("data", data);
    console.log("...data", { ...data });

    if (loading) return;
    //(data)를 ({...data})로 열고 안에 있는 데이터를 꺼낸 다음 위도와 경도를 같이 넣었다.
    post({ ...data, latitude, longitude });
  };
  useEffect(() => {
    //post요청을 보내면, 새로 만들어진 post의 id가 담긴 res를 받을 것
    if (data && data.ok) {
      router.push(`/community/${data?.post.id}`);
    }
  }, [data, router]);
  return (
    <form onSubmit={handleSubmit(onValid)} className="px-4 py-10">
      <TextArea
        register={register("question", { required: true, minLength: 5 })}
        required
        placeholder="질문하세요!"
      />
      <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
        {loading ? "loading..." : "submit"}
      </button>
    </form>
  );
};

export default Write;
