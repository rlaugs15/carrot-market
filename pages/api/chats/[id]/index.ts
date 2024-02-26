import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, {
  ResponesType,
  SessionData,
} from "@/libs/server/withHandler";
import { IronSession } from "iron-session";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>,
  session: IronSession<SessionData>
) {
  const {
    body: { message },
    query: { id },
  } = req;
  if (req.method === "GET") {
    const chatRoom = await client.chatRoom.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        ChatMessages: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    res.json({ ok: true, chatRoom });
  }
  if (req.method === "POST") {
    const chatMessage = await client.chatMessages.create({
      data: {
        message,
        user: {
          connect: {
            id: session.user?.id,
          },
        },
        chatRoom: {
          connect: {
            id: +id!,
          },
        },
      },
    });
    res.json({ ok: true, chatMessage });
  }
}

export default withHandler({ methods: ["GET", "POST"], handler });
