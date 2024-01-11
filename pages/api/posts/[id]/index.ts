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

  const post = await client.post.findUnique({
    where: {
      id: +id!,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      Answers: {
        select: {
          answer: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      //api url에서 확인
      _count: {
        select: { Answers: true, Wonderings: true },
      },
    },
  });
  const isWondering = Boolean(
    await client.wondering.findFirst({
      where: {
        userId: session.user?.id,
        postId: +id!,
      },
      select: {
        id: true,
      },
    })
  );
  return res.json({ ok: true, post, isWondering });
}

export default withHandler({ methods: ["GET"], handler });
