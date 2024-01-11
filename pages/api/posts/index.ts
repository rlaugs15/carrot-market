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
  const { question } = req.body;
  const post = await client.post.create({
    data: {
      question,
      user: {
        connect: {
          id: session.user!.id,
        },
      },
    },
  });
  return res.json({ ok: true, post });
}

export default withHandler({ methods: ["POST"], handler });
