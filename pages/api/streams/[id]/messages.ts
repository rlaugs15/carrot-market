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
    body,
  } = req;
  const message = await client.message.create({
    data: {
      message: body.message,
      user: {
        connect: {
          id: session.user?.id,
        },
      },
      stream: {
        connect: {
          id: +id!,
        },
      },
    },
  });
  res.json({ ok: true, message });
}

export default withHandler({ methods: ["POST"], handler });
