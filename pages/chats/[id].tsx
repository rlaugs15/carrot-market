import Message from "@/components/message";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { ChatMessages, ChatRoom, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface ChatMessagesWithUser extends ChatMessages {
  user: User;
}

interface ChatRoomWithCathMessages extends ChatRoom {
  ChatMessages: ChatMessagesWithUser[];
}

interface IChatRoom {
  ok: boolean;
  chatRoom: ChatRoomWithCathMessages;
}

interface IChatMutation {
  ok: boolean;
  chatMessage: ChatMessages;
}

interface IChatForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate: chatMutate } = useSWR<IChatRoom>(
    `/api/chats/${router.query.id}`
  );
  const { register, handleSubmit, reset } = useForm<IChatForm>();
  const [chatMutation] = useMutation<IChatMutation>(
    `/api/chats/${router.query.id}`
  );
  const onChatting = ({ message }: IChatForm) => {
    chatMutation({ message });
    reset({ message: "" });
    chatMutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            ChatMessages: [
              ...prev.chatRoom.ChatMessages,
              { id: Date.now(), message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
  };
  return (
    <div className="py-10 pb-16 px-4 space-y-4">
      {data?.chatRoom?.ChatMessages?.map((message) => (
        <Message
          key={message.id}
          message={message.message}
          reversed={user?.id === message.user.id}
          avatarUrl={
            message.user.avatar ? String(message.user.avatar) : undefined
          }
        />
      ))}
      <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
        <form onSubmit={handleSubmit(onChatting)}>
          <div className="flex relative max-w-md items-center  w-full mx-auto">
            <input
              {...register("message")}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChatDetail;
