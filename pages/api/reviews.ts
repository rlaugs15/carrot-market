import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, {
  ResponesType,
  SessionData,
} from "@/libs/server/withHandler";
import { getIronSession, IronSession } from "iron-session";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>,
  session: IronSession<SessionData>
) {
  const reviews = await client.review.findMany({
    where: { createdForId: session.user?.id },
    include: { createdBy: { select: { id: true, name: true, avatar: true } } },
  });
  return res.json({ ok: true, reviews });
}

export default withHandler({ methods: ["GET"], handler });
