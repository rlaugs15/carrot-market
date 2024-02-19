import { NextPage } from "next";
import Layout from "./../../components/layout";
import Input from "./../../components/input";
import Button from "./../../components/button";
import { useForm } from "react-hook-form";
import useUser from "@/libs/client/useUser";
import { useEffect, useState } from "react";
import useMutation from "@/libs/client/useMutation";
import { useRouter } from "next/router";

interface EditProfileForm {
  avatar?: FileList; //콘솔로그해보면 프로토타입이 파일리스트
  name?: string;
  email?: string;
  phone?: string;
  formErrors?: string;
}

interface EditProfileResponese {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponese>("/api/users/me");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
    resetField,
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.name) setValue("name", user.name);
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/FctlJjFO0tAVe2g_0a3fiA/${user.avatar}/avatar`
      );
  }, [user, setValue]);

  const onValid = async ({ name, email, phone, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "") {
      setError("formErrors", {
        message: "email과 phone 중 하나를 입력하세요.",
      });
    }
    if (avatar && avatar.length > 0) {
      //클라우드플레어에게 url 요청
      const { id, uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      //3번째 인자로 이미지파일의 이름을 유저의 id로 했다.
      form.append("file", avatar[0], user?.id + "");
      await fetch(uploadURL, {
        method: "POST",
        body: form,
      });
      //파일 업로드
      editProfile({ name, email, phone, avatarId: id });
    } else {
      /* 각각 email, phone이 유저의 email, phone과 다를 때만 백엔드로 보냄
    하지만 백엔드에서 하는게 더 좋아보인다.
    editProfile({
      email: email !== user?.email ? email : "",
      phone: phone !== user?.phone ? phone : "",
    }); */
      editProfile({ name, email, phone });
    }
  };
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      setError("formErrors", { message: data.error });
    }
    if (data && data.ok) {
      router.back();
    }
  }, [data, router, setError]);

  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar");
  //avatar 미리보기
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      //avatar는 FileList고 첫 원소가 파일으므로
      const file = avatar[0]; //브라우저 메모리에 있는 파일
      setAvatarPreview(URL.createObjectURL(file)); //URL.createObjectURL()을 통해서 file에 접근
    } else return;
  }, [avatar]);
  const cancelAvatar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview("");
    resetField("avatar");
  };
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
          <button
            onClick={cancelAvatar}
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            cancel
          </button>
        </div>
        <Input
          register={register("name")}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="text-red-400 font-semibold">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button loading={loading} text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
