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
  const { productId, invitedId } = req.query;
  if (req.method === "GET") {
    const chatRooms = await client.chatRoom.findMany({
      where: {
        OR: [{ hostId: session.user?.id }, { invitedId: session.user?.id }],
      },
      include: {
        host: {
          select: { id: true, name: true, avatar: true },
        },
        invited: {
          select: { id: true, name: true, avatar: true },
        },
        ChatMessages: {
          select: {
            message: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    res.json({ ok: true, chatRooms });
  }
  if (req.method === "POST") {
    const exist = await client.chatRoom.findFirst({
      where: {
        hostId: session.user?.id,
        invitedId: Number(invitedId),
        productId: Number(productId),
      },
    });
    if (exist) {
      const chatRoom = await client.chatRoom.findUnique({
        where: {
          id: exist.id,
        },
      });
      res.json({ ok: true, chatRoom });
    }
    if (!exist) {
      const chatRoom = await client.chatRoom.create({
        data: {
          hostId: Number(session.user?.id),
          invitedId: Number(invitedId),
          productId: Number(productId),
        },
      });
      res.json({ ok: true, chatRoom });
    }
  }
}

export default withHandler({ methods: ["GET", "POST"], handler });
