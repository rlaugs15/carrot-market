import type { NextPage } from "next";
import Layout from "./../../components/layout";
import useSWR from "swr";
import { ChatMessages, ChatRoom } from "@prisma/client";
import useUser from "@/libs/client/useUser";
import Link from "next/link";
import Image from "next/image";

interface ChatRoomWithMessage extends ChatRoom {
  host: { id: number; name: string; avatar?: string };
  invited: { id: number; name: string; avatar?: string };
  ChatMessages: ChatMessages[];
}

interface IChatRoom {
  ok: boolean;
  chatRooms: ChatRoomWithMessage[];
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<IChatRoom>("/api/chats");
  return (
    <Layout hasTabBar title="채팅">
      <div className="py-10 divide-y-[1px] ">
        {data?.chatRooms.map((chatRoom) => (
          <Link href={`/chats/${chatRoom.id}`}>
            <div
              key={chatRoom.id}
              className="flex px-4 cursor-pointer py-3 items-center space-x-3"
            >
              {user?.id === chatRoom.host.id ? (
                chatRoom.invited.avatar ? (
                  <Image
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                    src={`https://imagedelivery.net/FctlJjFO0tAVe2g_0a3fiA/${chatRoom.invited.avatar}/categoryImage`}
                    alt="프로필 사진"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-300" />
                )
              ) : chatRoom.host.avatar ? (
                <Image
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                  src={`https://imagedelivery.net/FctlJjFO0tAVe2g_0a3fiA/${chatRoom.host.avatar}/categoryImage`}
                  alt="프로필 사진"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-300" />
              )}

              <div>
                <p className="text-gray-700">
                  {user?.id === chatRoom.host.id
                    ? chatRoom.invited.name
                    : chatRoom.host.name}
                </p>
                <p className="text-sm  text-gray-500">
                  {chatRoom.ChatMessages.map((messages) => messages.message)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
