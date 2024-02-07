import { NextPage } from "next";
import Layout from "../../components/layout";
import Message from "../../components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream, User } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";

interface MessagesWithUser {
  id: number;
  message: string;
  user: User;
}

interface StreamWithMessages extends Stream {
  Messages: MessagesWithUser[];
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessages;
  error?: string;
}

interface IFormMessage {
  message: string;
}

const StreamPage: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 } //1초마다 확인하는 옵션
  );
  // /stream페이지에서 오면 괜찮지만
  //유저가 url의 id 부분에 아무 숫자나 치면 useEffect에서 data와 stream의 존재를 확인하는 로직을 우회
  //js는 undefined 또는 null 값에는 속성이 없다고 판단하고 TypeError를 발생
  //data?.stream.name가 아닌 data?.stream?.name처럼 옵셔널 체이닝으로 방지하면 제대로 동작
  useEffect(() => {
    if (data && !data.stream) {
      router.replace("/errorpage");
    }
  }, [data, router]);
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const { register, handleSubmit, reset } = useForm<IFormMessage>();
  const onValid = ({ message }: IFormMessage) => {
    if (loading) return;
    //패치를 기다리지 않고 바로 보일 수 있도록 가짜 데이터를 보여줘서 실시간 경험 최대화
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            Messages: [
              ...prev.stream.Messages,
              { id: Date.now(), message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    //sendMessage({ message });
    reset({ message: "" });
  };

  return (
    <Layout canGoBack>
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            {data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream.Messages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={user?.id === message.user.id}
              />
            ))}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <div className="flex relative max-w-md items-center  w-full mx-auto">
              <form onSubmit={handleSubmit(onValid)} className="w-full">
                <input
                  {...register("message", { required: true })}
                  type="text"
                  className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
                />
                <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                  <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                    &rarr;
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamPage;
