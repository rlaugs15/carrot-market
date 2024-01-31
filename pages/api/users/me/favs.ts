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
  const favs = await client.fav.findMany({
    where: { userId: session.user!.id },
    include: {
      product: {
        include: {
          _count: {
            select: {
              Favs: true,
            },
          },
        },
      },
    },
  });
  return res.json({ ok: true, favs });
}

export default withHandler({ methods: ["GET"], handler });
