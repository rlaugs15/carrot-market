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
    query: { id },
    body: { answer },
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: +id!,
    },
    select: {
      id: true,
    },
  });
  if (!post) return res.status(404).end;
  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: { id: session.user?.id },
      },
      post: {
        connect: { id: +id! },
      },
      answer: answer,
    },
  });
  return res.json({ ok: true, answer: newAnswer });
}

export default withHandler({ methods: ["POST"], handler });
