// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, {
  ResponesType,
  SessionData,
} from "@/libs/server/withHandler";
import { IronSession } from "iron-session";

/* declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      admin?: boolean;
    };
  }
} */

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>,
  session: IronSession<SessionData>
) {
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true },
  });
  if (!exists) return res.status(404).end();
  session.user = {
    id: exists?.userId,
  };
  await session.save();
  //토큰을 전부 갖고 있을 필요가 없기 때문에 유저에게 응답 전에 토근을 전부 삭제
  await client.token.deleteMany({
    where: {
      userId: exists.userId,
    },
  });
  return res.json({ ok: true });
}

export default withHandler({ methods: ["POST"], handler });
