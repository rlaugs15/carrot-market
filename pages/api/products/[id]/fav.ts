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
  const { id } = req.query;
  const exits = await client.fav.findFirst({
    where: {
      userId: session.user?.id,
      productId: +id!,
    },
  });
  if (exits) {
    await client.fav.delete({
      where: {
        id: exits.id,
      },
    });
  } else {
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: session.user?.id,
          },
        },
        product: {
          connect: {
            id: +id!,
          },
        },
      },
    });
  }
  return res.json({ ok: true });
}

export default withHandler({ methods: ["POST"], handler });
