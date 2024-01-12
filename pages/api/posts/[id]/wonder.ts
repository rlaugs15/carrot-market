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
  const { id } = req.query;
  const post = await client.post.findUnique({
    where: {
      id: +id!,
    },
    select: {
      id: true,
    },
  });
  if (!post) return res.status(404).end;
  const exits = await client.wondering.findFirst({
    where: {
      userId: session.user?.id,
      postId: +id!,
    },
  });
  if (exits) {
    await client.wondering.delete({
      where: { id: exits.id },
    });
  } else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: session.user?.id,
          },
        },
        post: {
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
