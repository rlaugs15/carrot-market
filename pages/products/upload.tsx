import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../components/layout";
import useMutation from "../../libs/client/useMutation";
import { Product } from "@prisma/client";
import useUser from "@/libs/client/useUser";

interface UploadItemForm {
  name: string;
  price: number;
  description: string;
  image: FileList;
}

interface UploadItemMutation {
  ok: boolean;
  product: Product; //프리즈마로부터 모델의 타입을 받을 수 있다.
}

const Upload: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadItemForm>();
  const [uploadItem, { loading, data }] =
    useMutation<UploadItemMutation>("/api/products");
  const onValue = async ({
    name,
    price,
    description,
    image,
  }: UploadItemForm) => {
    if (loading) return;
    const { id, uploadURL } = await (await fetch("/api/files")).json();
    const form = new FormData();
    form.append("file", image[0], user?.id + "");
    await fetch(uploadURL, {
      method: "POST",
      body: form,
    });
    uploadItem({ name, price, description, image: id });
  };
  const image = watch("image");
  const [imavePreview, setImavePreview] = useState("");
  //이미지 미리보기
  useEffect(() => {
    let url = "";
    if (image && image.length > 0) {
      const file = image[0];
      url = URL.createObjectURL(file);
      setImavePreview(url);
    } else return;
    //클린업 함수
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Upload Product">
      <form onSubmit={handleSubmit(onValue)} className="p-4 space-y-4">
        <div>
          {imavePreview ? (
            <label className="w-auto cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-auto rounded-md">
              <img src={imavePreview} />
              <input
                {...register("image", { required: true })}
                className="hidden"
                type="file"
                accept="image/*"
                required
              />
            </label>
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("image", { required: true })}
                className="hidden"
                type="file"
                accept="image/*"
                required
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />
        <Button text={loading ? "loading..." : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;
