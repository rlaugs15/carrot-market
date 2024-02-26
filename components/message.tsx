import { cls } from "@/libs/client/utils";
import Image from "next/image";

interface MessageProps {
  message: string;
  avatarUrl?: string;
  reversed?: boolean;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start space-x-2",
        reversed ? "flex-row-reverse space-x-reverse " : ""
      )}
    >
      {!reversed ? (
        avatarUrl ? (
          <img
            src={`https://imagedelivery.net/FctlJjFO0tAVe2g_0a3fiA/${avatarUrl}/categoryImage`}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-400" />
        )
      ) : null}
      <div
        className={cls(
          "w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md",
          reversed ? "bg-orange-400" : ""
        )}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
